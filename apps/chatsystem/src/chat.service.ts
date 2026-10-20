import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KafkaService } from './kafka.service';
import { UserCheckService, parseId } from './auth-check.service';

const randomCode = () => randomBytes(6).toString('base64url');

function shortAgo(d: Date) {
  const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const TOPICS = { messages: 'messages', presence: 'presence', voice: 'voice_state' } as const;

const s = (v: bigint | number | string | null | undefined) =>
  v == null ? undefined : String(v);

/** BigInt-safe shaping of a Message row for the wire. Never include userTagId. */
const shapeMessage = (m: any) => ({
  id: s(m.messageId),
  channelId: s(m.channelId ?? m.dmChannelId),
  senderId: s(m.authorId),
  senderName: m.author?.username ?? 'Unknown',
  avatarUrl: m.author?.avatarUrl ?? null,
  message: m.content,
  createdAt: m.createdAt.toISOString(),
  editedAt: m.editedAt ? m.editedAt.toISOString() : null,
});

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaService,
    private readonly userCheck: UserCheckService,
  ) {}

  // ---------- identity helpers ----------
  /**
   * Caller identity. Input = userTagId (secret hash from client).
   * Output = internal numeric User.userId. 401 on fail.
   */
  private async uid(userTagId: string): Promise<bigint> {
    return (await this.userCheck.requireUser(userTagId)).userId;
  }

  /** Target user (public numeric id, not the caller): 400 / 404. */
  private async targetUser(id: string, name = 'id'): Promise<bigint> {
    const uid = parseId(id, name);
    const u = await this.prisma.user.findUnique({
      where: { userId: uid },
      select: { userId: true },
    });
    if (!u) throw new NotFoundException('User not found');
    return uid;
  }

  // ---------- users ----------
  async getUsers(userTagId: string) {
    const uid = await this.uid(userTagId);
    const users = await this.prisma.user.findMany({
      where: { userId: uid },
      select: { userId: true, username: true },
    });
    return users.map((u) => ({ id: s(u.userId), name: u.username, username: u.username }));
  }

  async getUser(id: string, userTagId: string) {
    const uid = parseId(id, 'id');
    const callerId = await this.uid(userTagId);
    if (uid !== callerId) throw new ForbiddenException('Cannot read another user');
    const user = await this.prisma.user.findUnique({ where: { userId: uid } });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: s(user.userId),
      name: user.username,
      username: user.username,
      avatarUrl: user.avatarUrl,
      roleTitle: user.roleTitle,
      currentActivity: user.currentActivity,
      subject: user.currentActivity,
      status: user.lastPresence ?? 'offline',
      // ! userTagId intentionally omitted
    };
  }

  /** Caller must be the user being edited. */
  async updateUser(
    id: string,
    userTagId: string,
    data: { name?: string; roleTitle?: string; currentActivity?: string; avatarUrl?: string },
  ) {
    const callerId = await this.uid(userTagId);
    const targetId = parseId(id, 'id');
    if (callerId !== targetId) throw new ForbiddenException('Cannot edit another user');
    await this.prisma.user.update({
      where: { userId: targetId },
      data: {
        username: data.name || undefined,
        roleTitle: data.roleTitle || undefined,
        currentActivity: data.currentActivity || undefined,
        avatarUrl: data.avatarUrl || undefined,
      },
    });
    return this.getUser(String(targetId), userTagId);
  }

  // ---------- guilds ("collectives") ----------
  /** every channel in a guild that isn't a category, with last message info */
  private guildChannels(guildId: bigint) {
    return this.prisma.channel.findMany({
      where: { guildId, type: { not: 'CATEGORY' } },
      orderBy: { position: 'asc' },
      include: {
        _count: { select: { messages: true } },
        messages: { orderBy: { messageId: 'desc' }, take: 1, include: { author: { select: { username: true } } } },
      },
    });
  }

  private shapeRoom(c: any, memberCount: number, isMember: boolean) {
    const last = c.messages?.[0];
    return {
      id: s(c.channelId),
      channelId: s(c.channelId),
      collectiveId: s(c.guildId),
      name: c.name,
      topic: c.topic ?? '',
      icon: c.icon ?? 'tag',
      type: c.type,
      capacity: c.capacity,
      memberCount,
      messageCount: c._count?.messages ?? 0,
      isMember,
      lastMessage: last ? `${last.author?.username ?? 'Unknown'}: ${last.content}` : null,
      lastActiveAt: last ? last.createdAt.toISOString() : null,
    };
  }

  async getCollectives(userTagId: string) {
    const uid = await this.uid(userTagId);
    const memberships = await this.prisma.member.findMany({
      where: { userId: uid },
      select: { guildId: true },
    });
    const guildIds = memberships.map((m) => m.guildId);
    if (!guildIds.length) return [];
    const guilds = await this.prisma.guild.findMany({
      where: { guildId: { in: guildIds } },
      include: { owner: { select: { username: true } } },
      orderBy: { guildId: 'asc' },
    });
    const out = [];
    for (const g of guilds) {
      const channels = await this.guildChannels(g.guildId);
      out.push({
        id: s(g.guildId),
        collectiveId: s(g.guildId),
        name: g.name,
        iconUrl: g.iconUrl,
        ownerId: s(g.ownerId),
        ownerName: g.owner.username,
        memberCount: g.memberCount,
        roomCount: channels.filter((c) => c.type === 'TEXT').length,
      });
    }
    return out;
  }

  async createCollective(userTagId: string, name: string) {
    const uid = await this.uid(userTagId);
    if (!name?.trim()) throw new BadRequestException('name required');
    const guild = await this.prisma.guild.create({
      data: {
        name: name.trim(),
        ownerId: uid,
        memberCount: 1,
        members: { create: [{ userId: uid }] },
        channels: { create: [{ name: 'general', topic: 'General discussion' }] },
      },
    });
    return { id: s(guild.guildId), name: guild.name };
  }

  async getCollectiveRooms(collectiveId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const gid = parseId(collectiveId, 'collectiveId');
    const guild = await this.prisma.guild.findUnique({ where: { guildId: gid } });
    if (!guild) throw new NotFoundException('Collective not found');
    const isMember = !!(await this.prisma.member.findUnique({
      where: { guildId_userId: { guildId: gid, userId: uid } },
    }));
    if (!isMember) throw new ForbiddenException('Not a member of this collective');
    const channels = await this.guildChannels(gid);
    return channels.map((c) => this.shapeRoom(c, guild.memberCount, isMember));
  }

  async createCollectiveRoom(
    collectiveId: string,
    userTagId: string,
    data: { name: string; topic?: string; capacity?: number; icon?: string; type?: string },
  ) {
    const uid = await this.uid(userTagId);
    const gid = parseId(collectiveId, 'collectiveId');
    await this.assertMember(gid, uid);
    if (!data.name?.trim()) throw new BadRequestException('name required');
    const count = await this.prisma.channel.count({ where: { guildId: gid } });
    const channel = await this.prisma.channel.create({
      data: {
        guildId: gid,
        name: data.name.trim().toLowerCase().replace(/\s+/g, '-'),
        topic: data.topic?.trim() || null,
        icon: data.icon || 'tag',
        type: data.type === 'VOICE' ? 'VOICE' : 'TEXT',
        capacity: Math.min(Math.max(Number(data.capacity) || 100, 2), 100_000),
        position: count,
      },
    });
    return { id: s(channel.channelId), name: channel.name };
  }

  // ---------- membership / invites ----------
  private async assertMember(guildId: bigint, userId: bigint) {
    const ok = await this.prisma.member.findUnique({
      where: { guildId_userId: { guildId, userId } },
    });
    if (!ok) throw new ForbiddenException('Not a member of this collective');
  }

  // async joinRoom(roomId: string, userTagId: string) {
  //   const uid = await this.uid(userTagId);
  //   const cid = parseId(roomId, 'roomId');
  //   const channel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
  //   if (!channel) throw new NotFoundException('Room not found');
  //   const member = await this.prisma.member.findUnique({
  //     where: { guildId_userId: { guildId: channel.guildId, userId: uid } },
  //   });
  //   if (!member) {
  //     await this.prisma.$transaction([
  //       this.prisma.member.create({ data: { guildId: channel.guildId, userId: uid } }),
  //       this.prisma.guild.update({
  //         where: { guildId: channel.guildId },
  //         data: { memberCount: { increment: 1 } },
  //       }),
  //     ]);
  //   }
  //   return { ok: true, collectiveId: s(channel.guildId) };
  // }

  async createInvite(collectiveId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const gid = parseId(collectiveId, 'collectiveId');
    await this.assertMember(gid, uid);
    const invite = await this.prisma.invite.create({
      data: { guildId: gid, code: randomCode(), createdById: uid },
    });
    return { token: invite.code, collectiveId: s(invite.guildId) };
  }

  async joinByInvite(token: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const invite = await this.prisma.invite.findUnique({ where: { code: String(token ?? '') } });
    if (!invite) throw new NotFoundException('Invalid invite');
    const existing = await this.prisma.member.findUnique({
      where: { guildId_userId: { guildId: invite.guildId, userId: uid } },
    });
    if (!existing) {
      await this.prisma.$transaction([
        this.prisma.member.create({ data: { guildId: invite.guildId, userId: uid } }),
        this.prisma.guild.update({
          where: { guildId: invite.guildId },
          data: { memberCount: { increment: 1 } },
        }),
      ]);
    }
    const guild = await this.prisma.guild.findUnique({ where: { guildId: invite.guildId } });
    return { id: s(invite.guildId), name: guild?.name };
  }

  // ---------- messages ----------
  /**
   * Resolve a room id against BOTH channel tables. Missing room -> 403
   * (same as no access) so ids can't be probed.
   */
  private async resolveChannel(cid: bigint) {
    const guildChannel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    if (guildChannel) return { kind: 'guild' as const, channel: guildChannel };
    const dmChannel = await this.prisma.directChannel.findUnique({ where: { channelId: cid } });
    if (dmChannel) return { kind: 'dm' as const, channel: dmChannel };
    throw new ForbiddenException('No access');
  }

  /** Membership check that works for guild channels and DM channels alike. */
  private async assertCanReadChannel(channelId: bigint, userId: bigint) {
    const resolved = await this.resolveChannel(channelId);
    if (resolved.kind === 'guild') {
      await this.assertMember(resolved.channel.guildId, userId);
    } else {
      const isMember = await this.prisma.directChannelMember.findFirst({
        where: { channelId, userId },
        select: { channelId: true },
      });
      if (!isMember) throw new ForbiddenException('Not a member of this conversation');
    }
    return resolved;
  }

  async getRoomMessages(roomId: string, userTagId: string, limit = 50, before?: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(roomId, 'roomId');
    const beforeId = before ? parseId(before, 'before') : undefined;
    const resolved = await this.assertCanReadChannel(cid, uid);
    const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const messages = await this.prisma.message.findMany({
      where: {
        ...(resolved.kind === 'guild' ? { channelId: cid } : { dmChannelId: cid }),
        ...(beforeId !== undefined ? { messageId: { lt: beforeId } } : {}),
      },
      orderBy: { messageId: 'desc' },
      take: take + 1,
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
    const hasMore = messages.length > take;
    return {
      items: messages.slice(0, take).reverse().map(shapeMessage),
      hasMore,
    };
  }

  /** Guild channels only (used by the roster endpoint). */
  private async assertGuildChannel(channelId: bigint, userId: bigint) {
    const resolved = await this.resolveChannel(channelId);
    if (resolved.kind !== 'guild') throw new ForbiddenException('No access');
    await this.assertMember(resolved.channel.guildId, userId);
    return resolved.channel;
  }

  /** Public entry: caller identified by userTagId. */
  async createRoomMessage(roomId: string, userTagId: string, content: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(roomId, 'roomId');
    return this.postMessage(uid, cid, content);
  }

  /** Internal: identity already verified. validate -> persist -> publish to Kafka. */
  private async postMessage(uid: bigint, cid: bigint, content: string) {
    const text = String(content ?? '').trim();
    if (!text) throw new BadRequestException('Empty message');
    if (text.length > 4000) throw new BadRequestException('Message too long');
    const resolved = await this.assertCanReadChannel(cid, uid);

    const message = await this.prisma.message.create({
      data: {
        ...(resolved.kind === 'guild' ? { channelId: cid } : { dmChannelId: cid }),
        authorId: uid,
        content: text,
      },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });

    const payload = {
      channel_id: String(cid),
      ...(resolved.kind === 'guild' ? { guild_id: String(resolved.channel.guildId) } : {}),
      message_id: String(message.messageId),
      author_id: String(message.authorId),
      author: { id: String(message.authorId), username: message.author.username },
      content: message.content,
      timestamp: message.createdAt.toISOString(),
    };
    // fire-and-forget; ordering guaranteed by partition key = channel_id
    void this.kafka.publish(TOPICS.messages, `channel:${cid}`, payload);

    return shapeMessage(message);
  }

  async editMessage(roomId: string, messageId: string, userTagId: string, content: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(roomId, 'roomId');
    const mid = parseId(messageId, 'messageId');
    const text = String(content ?? '').trim();
    if (!text) throw new BadRequestException('Empty message');
    if (text.length > 4000) throw new BadRequestException('Message too long');

    const message = await this.prisma.message.findUnique({ where: { messageId: mid } });
    if (!message || (message.channelId ?? message.dmChannelId) !== cid) throw new NotFoundException('Message not found');
    if (message.authorId !== uid) throw new ForbiddenException('Cannot edit');

    const updated = await this.prisma.message.update({
      where: { messageId: mid },
      data: { content: text, editedAt: new Date() },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
    const messageChannelId = message.channelId ?? message.dmChannelId;
    void this.kafka.publish(TOPICS.messages, `channel:${messageChannelId}`, {
      channel_id: String(messageChannelId),
      message_id: String(mid),
      type: 'MESSAGE_EDIT',
      content: updated.content,
      timestamp: new Date().toISOString(),
    });
    return shapeMessage(updated);
  }

  async deleteMessage(roomId: string, messageId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(roomId, 'roomId');
    const mid = parseId(messageId, 'messageId');

    const message = await this.prisma.message.findUnique({ where: { messageId: mid } });
    if (!message || (message.channelId ?? message.dmChannelId) !== cid) throw new NotFoundException('Message not found');
    if (message.authorId !== uid) throw new ForbiddenException('Cannot delete');

    await this.prisma.message.delete({ where: { messageId: mid } });
    const messageChannelId = message.channelId ?? message.dmChannelId;
    void this.kafka.publish(TOPICS.messages, `channel:${messageChannelId}`, {
      channel_id: String(messageChannelId),
      message_id: String(mid),
      type: 'MESSAGE_DELETE',
      timestamp: new Date().toISOString(),
    });
    return { ok: true, id: String(mid) };
  }

  // ---------- roster / presence ----------
  async getRoomMembers(roomId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(roomId, 'roomId');
    const channel = await this.assertGuildChannel(cid, uid);
    const members = await this.prisma.member.findMany({
      where: { guildId: channel.guildId },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
            roleTitle: true,
            currentActivity: true,
            lastPresence: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
    return members.map((m) => ({
      id: s(m.userId),
      userId: s(m.userId),
      username: m.user.username,
      name: m.user.username,
      nickname: m.nickname,
      avatarUrl: m.user.avatarUrl,
      roleTitle: m.user.roleTitle,
      currentActivity: m.user.currentActivity,
      status: m.user.lastPresence ?? 'offline',
      inVoice: m.voiceChannelId != null,
      voiceChannelId: s(m.voiceChannelId),
    }));
  }

  async setPresence(userTagId: string, status: string) {
    const uid = await this.uid(userTagId);
    if (!['online', 'idle', 'dnd'].includes(status))
      throw new BadRequestException('bad status');
    await this.prisma.user.update({
      where: { userId: uid },
      data: { lastPresence: status },
    });
    void this.kafka.publish(TOPICS.presence, `user:${uid}`, {
      user_id: String(uid),
      status,
      timestamp: new Date().toISOString(),
    });
    return { ok: true };
  }

  // ---------- DMs (friend graph, direct channels) ----------
  async getDirectMessages(userTagId: string) {
    const uid = await this.uid(userTagId);
    const friendships = await this.prisma.friendship.findMany({
      where: { userId: uid },
      include: {
        friend: {
          select: {
            username: true,
            avatarUrl: true,
            roleTitle: true,
            lastPresence: true,
          },
        },
      },
    });
    const out = [];
    for (const f of friendships) {
      const lo = uid < f.friendId ? uid : f.friendId;
      const hi = uid < f.friendId ? f.friendId : uid;
      const dm = await this.prisma.directChannel.findUnique({ where: { userA_userB: { userA: lo, userB: hi } } });
      if (!dm) {
        out.push({ partnerId: s(f.friendId), id: s(f.friendId), name: f.friend.username, username: f.friend.username, avatarUrl: f.friend.avatarUrl, roleTitle: f.friend.roleTitle, status: f.friend.lastPresence ?? 'offline', channelId: null, lastMessage: null, lastActiveLabel: '', unreadCount: 0 });
        continue;
      }
      const readState = await this.prisma.directChannelMember.findUnique({ where: { channelId_userId: { channelId: dm.channelId, userId: uid } }, select: { lastReadMessageId: true } });
      const last = await this.prisma.message.findFirst({
        where: { dmChannelId: dm.channelId },
        orderBy: { messageId: 'desc' },
        include: { author: { select: { username: true } } },
      });
      const unread = await this.prisma.message.count({
        where: { dmChannelId: dm.channelId, authorId: { not: uid }, messageId: { gt: readState?.lastReadMessageId ?? 0n } },
      });
      out.push({
        partnerId: s(f.friendId),
        id: s(f.friendId),
        name: f.friend.username,
        username: f.friend.username,
        avatarUrl: f.friend.avatarUrl,
        roleTitle: f.friend.roleTitle,
        status: f.friend.lastPresence ?? 'offline',
        channelId: s(dm.channelId),
        lastMessage: last ? `${last.authorId === uid ? 'You' : last.author.username}: ${last.content}` : null,
        lastActiveLabel: last ? shortAgo(last.createdAt) : '',
        unreadCount: unread,
      });
    }
    return out;
  }

  async getDirectMessageHistory(userTagId: string, partnerId: string) {
    const uid = await this.uid(userTagId);
    const pid = await this.targetUser(partnerId, 'partnerId');
    await this.assertFriends(uid, pid);
    const dm = await this.getOrCreateDm(uid, pid);
    const messages = await this.prisma.message.findMany({
      where: { dmChannelId: dm.channelId },
      orderBy: { messageId: 'asc' },
      take: 200,
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
    const last = messages.at(-1);
    if (last) await this.markDmRead(uid, dm.channelId, last.messageId);
    return messages.map(shapeMessage);
  }

  async markDmRead(userTagId: string, partnerId: string) {
    const uid = await this.uid(userTagId);
    const pid = await this.targetUser(partnerId, 'partnerId');
    await this.assertFriends(uid, pid);
    const lo = uid < pid ? uid : pid;
    const hi = uid < pid ? pid : uid;
    const dm = await this.prisma.directChannel.findUnique({ where: { userA_userB: { userA: lo, userB: hi } } });
    if (!dm) return { ok: true };
    const last = await this.prisma.message.findFirst({ where: { dmChannelId: dm.channelId }, orderBy: { messageId: 'desc' }, select: { messageId: true } });
    if (last) await this.prisma.directChannelMember.update({ where: { channelId_userId: { channelId: dm.channelId, userId: uid } }, data: { lastReadMessageId: last.messageId } });
    return { ok: true };
  }

  async sendDirectMessage(userTagId: string, partnerId: string, content: string) {
    const uid = await this.uid(userTagId);
    const pid = await this.targetUser(partnerId, 'partnerId');
    await this.assertFriends(uid, pid);
    const dm = await this.getOrCreateDm(uid, pid);
    return this.postMessage(uid, dm.channelId, content);
  }

  private async getOrCreateDm(a: bigint, b: bigint) {
    if (a === b) throw new BadRequestException('Cannot DM self');
    const lo = a < b ? a : b;
    const hi = a < b ? b : a;
    let dm = await this.prisma.directChannel.findUnique({
      where: { userA_userB: { userA: lo, userB: hi } },
    });
    if (!dm) {
      try {
        dm = await this.prisma.$transaction(async (tx) => {
          const created = await tx.directChannel.create({ data: { userA: lo, userB: hi } });
          await tx.directChannelMember.createMany({ data: [{ channelId: created.channelId, userId: lo }, { channelId: created.channelId, userId: hi }] });
          return created;
        });
      } catch {
        dm = await this.prisma.directChannel.findUniqueOrThrow({ where: { userA_userB: { userA: lo, userB: hi } } });
      }
    }
    return dm;
  }

  private async assertFriends(a: bigint, b: bigint) {
    const friendship = await this.prisma.friendship.findUnique({ where: { userId_friendId: { userId: a, friendId: b } } });
    if (!friendship) throw new ForbiddenException('You must be friends to use direct messages');
  }

  /** add friend both ways -> creates DM channel */
  async addFriend(userTagId: string, partnerId: string) {
    const a = await this.uid(userTagId);
    const b = await this.targetUser(partnerId, 'partnerId');
    if (a === b) throw new BadRequestException('Cannot friend self');
    await this.prisma.$transaction([
      this.prisma.friendship.upsert({
        where: { userId_friendId: { userId: a, friendId: b } },
        update: {},
        create: { userId: a, friendId: b },
      }),
      this.prisma.friendship.upsert({
        where: { userId_friendId: { userId: b, friendId: a } },
        update: {},
        create: { userId: b, friendId: a },
      }),
    ]);
    await this.getOrCreateDm(a, b);
    return { ok: true };
  }

  // ---------- voice signaling passthrough events ----------
  async joinVoice(channelId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(channelId, 'channelId');
    const channel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    if (!channel || channel.type !== 'VOICE') throw new BadRequestException('Not a voice channel');
    await this.assertMember(channel.guildId, uid);
    await this.prisma.member.update({
      where: { guildId_userId: { guildId: channel.guildId, userId: uid } },
      data: { voiceChannelId: cid },
    });
    void this.kafka.publish(TOPICS.voice, `guild:${channel.guildId}`, {
      user_id: String(uid),
      channel_id: String(cid),
      guild_id: String(channel.guildId),
      action: 'join',
      self_mute: false,
      self_deaf: false,
    });
    return { ok: true, sfu: process.env.SFU_URL ?? 'wss://sfu.local.example/stream' };
  }

  async leaveVoice(channelId: string, userTagId: string) {
    const uid = await this.uid(userTagId);
    const cid = parseId(channelId, 'channelId');
    const channel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    if (!channel) throw new NotFoundException('Channel not found');
    await this.prisma.member.updateMany({
      where: { guildId: channel.guildId, userId: uid, voiceChannelId: cid },
      data: { voiceChannelId: null },
    });
    void this.kafka.publish(TOPICS.voice, `guild:${channel.guildId}`, {
      user_id: String(uid),
      channel_id: String(cid),
      guild_id: String(channel.guildId),
      action: 'leave',
      self_mute: false,
      self_deaf: false,
    });
    return { ok: true };
  }

  gatewayUrl() {
    return {
      url: process.env.GATEWAY_PUBLIC_URL ?? 'ws://localhost:3001/gateway',
    };
  }
}