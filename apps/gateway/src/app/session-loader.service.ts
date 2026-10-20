import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface LoadedSession {
  userId: string;
  username: string;
  guildIds: string[];
  channels: Map<string, string>; // channelId -> guildId
  friendIds: string[];
}

/**
 * The gateway validates the user_tag_id issued by the auth service.
 */
@Injectable()
export class SessionLoader {
  constructor(private readonly prisma: PrismaService) {}

  async load(token: string): Promise<LoadedSession | null> {
    const user = await this.prisma.user.findUnique({
      where: { userTagId: token },
      select: { userId: true, username: true },
    });
    if (!user) return null;
    const userId = user.userId;

    const [members, friends, directChannels] = await Promise.all([
      this.prisma.member.findMany({
        where: { userId },
        select: {
          guildId: true,
          guild: {
            select: {
              channels: {
                where: { type: { not: 'CATEGORY' } },
                select: { channelId: true },
              },
            },
          },
        },
      }),
      this.prisma.friendship.findMany({
        where: { userId },
        select: { friendId: true },
      }),
      this.prisma.directChannelMember.findMany({ where: { userId }, select: { channelId: true } }),
    ]);

    const channels = new Map<string, string>();
    for (const m of members)
      for (const c of m.guild.channels)
        channels.set(c.channelId.toString(), m.guildId.toString());
    for (const c of directChannels) channels.set(c.channelId.toString(), '');

    return {
      userId: userId.toString(),
      username: user.username,
      guildIds: members.map((m) => m.guildId.toString()),
      channels,
      friendIds: friends.map((f) => f.friendId.toString()),
    };
  }
}