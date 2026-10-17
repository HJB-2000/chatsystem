import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KafkaService } from './kafka.service';

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

/** BigInt-safe shaping of a Message row for the wire. */
const shapeMessage = (m: any) => ({
  id: s(m.messageId),
  channelId: s(m.channelId),
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
  ) {}

  // ---------- users ----------
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: { userId: true, username: true },
    });
    return users.map((u) => ({ id: s(u.userId), name: u.username, username: u.username }));
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { userId: BigInt(id) } });
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
    };
  }

  async updateUser(id: string, data: { name?: string; roleTitle?: string; currentActivity?: string; avatarUrl?: string }) {
    const user = await this.prisma.user.update({
      where: { userId: BigInt(id) },
      data: {
        username: data.name || undefined,
        roleTitle: data.roleTitle || undefined,
        currentActivity: data.currentActivity || undefined,
        avatarUrl: data.avatarUrl || undefined,
      },
    });
    return this.getUser(s(user.userId)!);
  }

  // ---------- guilds ("collectives") ----------
  /** every channel in a guild that isn't a category, with last message info */
  private guildChannels(guildId: bigint) {
    return this.prisma.channel.findMany({
      where: { guildId, type: { not: 'CATEGORY' } },
      orderBy: { position: 'asc' },
      include: {
        _count: { select: { messages: true } },
        messages: { orderBy: { messageId: 'desc' }, take: 1 },
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

  async getCollectives(userId: string) {
    const uid = BigInt(userId);
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

  async createCollective(userId: string, name: string) {
    if (!name?.trim()) throw new BadRequestException('name required');
    const uid = BigInt(userId);
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

  async getCollectiveRooms(collectiveId: string, userId: string) {
    const gid = BigInt(collectiveId);
    const uid = BigInt(userId);
    const guild = await this.prisma.guild.findUnique({ where: { guildId: gid } });
    if (!guild) throw new NotFoundException('Collective not found');
    const isMember = !!(await this.prisma.member.findUnique({
      where: { guildId_userId: { guildId: gid, userId: uid } },
    }));
    const channels = await this.guildChannels(gid);
    return channels.map((c) => this.shapeRoom(c, guild.memberCount, isMember));
  }

  async createCollectiveRoom(collectiveId: string, userId: string, data: { name: string; topic?: string; capacity?: number; icon?: string; type?: string }) {
    const gid = BigInt(collectiveId);
    await this.assertMember(gid, BigInt(userId));
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

  async joinRoom(roomId: string, userId: string) {
    const cid = BigInt(roomId);
    const uid = BigInt(userId);
    const channel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    if (!channel) throw new NotFoundException('Room not found');
    const member = await this.prisma.member.findUnique({
      where: { guildId_userId: { guildId: channel.guildId, userId: uid } },
    });
    if (!member) {
      await this.prisma.$transaction([
        this.prisma.member.create({ data: { guildId: channel.guildId, userId: uid } }),
        this.prisma.guild.update({
          where: { guildId: channel.guildId },
          data: { memberCount: { increment: 1 } },
        }),
      ]);
    }
    return { ok: true, collectiveId: s(channel.guildId) };
  }

  async createInvite(collectiveId: string, userId: string) {
    const gid = BigInt(collectiveId);
    await this.assertMember(gid, BigInt(userId));
    const invite = await this.prisma.invite.create({
      data: { guildId: gid, code: randomCode(), createdById: BigInt(userId) },
    });
    return { token: invite.code, collectiveId: s(invite.guildId) };
  }

  async joinByInvite(token: string, userId: string) {
    const uid = BigInt(userId);
    const invite = await this.prisma.invite.findUnique({ where: { code: token } });
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
   * Resolve a room id against BOTH channel tables. Guild channels and DM
   * channels now share one id sequence, but an id can only live in one of them.
   */
  private async resolveChannel(cid: bigint) {
    const guildChannel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    if (guildChannel) return { kind: 'guild' as const, channel: guildChannel };
    const dmChannel = await this.prisma.directChannel.findUnique({ where: { channelId: cid } });
    if (dmChannel) return { kind: 'dm' as const, channel: dmChannel };
    throw new NotFoundException('Room not found');
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

  async getRoomMessages(roomId: string, userId: string, limit = 50, before?: string) {
    const cid = BigInt(roomId);
    await this.assertCanReadChannel(cid, BigInt(userId));
    const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const messages = await this.prisma.message.findMany({
      where: {
        channelId: cid,
        ...(before ? { messageId: { lt: BigInt(before) } } : {}),
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
    if (resolved.kind !== 'guild') throw new NotFoundException('Room not found');
    await this.assertMember(resolved.channel.guildId, userId);
    return resolved.channel;
  }

  /** Spec flow: validate -> persist -> publish to Kafka (key = channel_id) */
  async createRoomMessage(roomId: string, senderId: string, content: string) {
    const cid = BigInt(roomId);
    const uid = BigInt(senderId);
    const text = String(content ?? '').trim();
    if (!text) throw new BadRequestException('Empty message');
    if (text.length > 4000) throw new BadRequestException('Message too long');
    // Works for guild channels AND DM channels (the old code rejected every DM).
    const resolved = await this.assertCanReadChannel(cid, uid);

    const message = await this.prisma.message.create({
      data: { channelId: cid, authorId: uid, content: text },
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

  async editMessage(roomId: string, messageId: string, userId: string, content: string) {
    const mid = BigInt(messageId);
    const message = await this.prisma.message.findUnique({ where: { messageId: mid } });
    if (!message || String(message.channelId) !== roomId)
      throw new NotFoundException('Message not found');
    if (message.authorId !== BigInt(userId)) throw new ForbiddenException('Cannot edit');
    const updated = await this.prisma.message.update({
      where: { messageId: mid },
      data: { content: String(content).trim(), editedAt: new Date() },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
    void this.kafka.publish(TOPICS.messages, `channel:${message.channelId}`, {
      channel_id: String(message.channelId),
      message_id: String(mid),
      type: 'MESSAGE_EDIT',
      content: updated.content,
      timestamp: new Date().toISOString(),
    });
    return shapeMessage(updated);
  }

  async deleteMessage(roomId: string, messageId: string, userId: string) {
    const mid = BigInt(messageId);
    const message = await this.prisma.message.findUnique({ where: { messageId: mid } });
    if (!message || String(message.channelId) !== roomId)
      throw new NotFoundException('Message not found');
    if (message.authorId !== BigInt(userId)) throw new ForbiddenException('Cannot delete');
    await this.prisma.message.delete({ where: { messageId: mid } });
    void this.kafka.publish(TOPICS.messages, `channel:${message.channelId}`, {
      channel_id: String(message.channelId),
      message_id: String(mid),
      type: 'MESSAGE_DELETE',
      timestamp: new Date().toISOString(),
    });
    return { ok: true, id: String(mid) };
  }

  // ---------- roster / presence ----------
  async getRoomMembers(roomId: string, userId: string) {
    const cid = BigInt(roomId);
    const channel = await this.assertGuildChannel(cid, BigInt(userId));
    const members = await this.prisma.member.findMany({
      where: { guildId: channel.guildId },
      include: { user: true },
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

  async setPresence(userId: string, status: string) {
    const uid = BigInt(userId);
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
  async getDirectMessages(userId: string) {
    const uid = BigInt(userId);
    const friendships = await this.prisma.friendship.findMany({
      where: { userId: uid },
      include: { friend: true },
    });
    const out = [];
    for (const f of friendships) {
      const dm = await this.getOrCreateDm(uid, f.friendId);
      const last = await this.prisma.message.findFirst({
        where: { channelId: dm.channelId },
        orderBy: { messageId: 'desc' },
        include: { author: { select: { username: true } } },
      });
      const unread = await this.prisma.message.count({
        where: { channelId: dm.channelId, authorId: { not: uid } },
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

  async getDirectMessageHistory(userId: string, partnerId: string) {
    const dm = await this.getOrCreateDm(BigInt(userId), BigInt(partnerId));
    const messages = await this.prisma.message.findMany({
      where: { channelId: dm.channelId },
      orderBy: { messageId: 'asc' },
      take: 200,
      include: { author: { select: { username: true } } },
    });
    return messages.map(shapeMessage);
  }

  async sendDirectMessage(userId: string, partnerId: string, content: string) {
    const dm = await this.getOrCreateDm(BigInt(userId), BigInt(partnerId));
    return this.createRoomMessage(String(dm.channelId), userId, content);
  }

  private async getOrCreateDm(a: bigint, b: bigint) {
    if (a === b) throw new BadRequestException('Cannot DM self');
    const lo = a < b ? a : b;
    const hi = a < b ? b : a;
    let dm = await this.prisma.directChannel.findUnique({
      where: { userA_userB: { userA: lo, userB: hi } },
    });
    if (!dm) {
      dm = await this.prisma.directChannel.create({ data: { userA: lo, userB: hi } });
      await this.prisma.directChannelMember.createMany({
        data: [
          { channelId: dm.channelId, userId: lo },
          { channelId: dm.channelId, userId: hi },
        ],
      });
    }
    return dm;
  }

  /** add friend both ways -> creates DM channel */
  async addFriend(userId: string, partnerId: string) {
    const a = BigInt(userId);
    const b = BigInt(partnerId);
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
  async joinVoice(channelId: string, userId: string) {
    const cid = BigInt(channelId);
    const uid = BigInt(userId);
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

  async leaveVoice(channelId: string, userId: string) {
    const cid = BigInt(channelId);
    const uid = BigInt(userId);
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
