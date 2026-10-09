import { Injectable } from '@nestjs/common';
import { ID_RE } from './protocol';
import { PrismaService } from './prisma.service';

export interface LoadedSession {
  userId: string;
  username: string;
  guildIds: string[];
  channels: Map<string, string>; // channelId -> guildId
  friendIds: string[];
}

/**
 * Stand-in for the auth service (spec: "Gateway validates token with auth
 * service, which returns user, servers, channels").
 * Auth is upstream and trusted: token == user id.
 * Replace body of load() with an HTTP call to the real service.
 */
@Injectable()
export class SessionLoader {
  constructor(private readonly prisma: PrismaService) {}

  async load(token: string): Promise<LoadedSession | null> {
    if (!ID_RE.test(token)) return null;
    const userId = BigInt(token);

    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { username: true },
    });
    if (!user) return null;

    const [members, friends] = await Promise.all([
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
    ]);

    const channels = new Map<string, string>();
    for (const m of members)
      for (const c of m.guild.channels)
        channels.set(c.channelId.toString(), m.guildId.toString());

    return {
      userId: userId.toString(),
      username: user.username,
      guildIds: members.map((m) => m.guildId.toString()),
      channels,
      friendIds: friends.map((f) => f.friendId.toString()),
    };
  }
}