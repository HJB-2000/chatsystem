import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const alice = await prisma.user.upsert({ where: { username: 'alice' }, update: {}, create: { username: 'alice' } });
  const bob = await prisma.user.upsert({ where: { username: 'bob' }, update: {}, create: { username: 'bob' } });

  const guild = await prisma.guild.create({
    data: {
      name: 'Test Guild',
      ownerId: alice.userId,
      memberCount: 2,
      members: { create: [{ userId: alice.userId }, { userId: bob.userId }] },
      channels: { create: [{ name: 'general' }] },
    },
    include: { channels: true },
  });

  console.log({
    alice: alice.userId.toString(),
    bob: bob.userId.toString(),
    guild: guild.guildId.toString(),
    channel: guild.channels[0].channelId.toString(),
  });
}

main().finally(() => prisma.$disconnect());