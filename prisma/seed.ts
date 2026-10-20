import 'dotenv/config';
import { randomBytes } from 'crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const newTag = () => randomBytes(32).toString('hex'); // 64 hex chars

const demoUsers = [
  { username: 'demo_user', roleTitle: 'Community Builder', currentActivity: 'Testing NexusCampus', avatarUrl: 'https://i.pravatar.cc/160?u=demo_user' },
  { username: 'demo_friend', roleTitle: 'Frontend Engineer', currentActivity: 'Reviewing the chat UI', avatarUrl: 'https://i.pravatar.cc/160?u=demo_friend' },
  { username: 'demo_moderator', roleTitle: 'Moderator', currentActivity: 'Online', avatarUrl: 'https://i.pravatar.cc/160?u=demo_moderator' },
];

/**
 * userTagId is set on create only. Re-running the seed must not rotate it.
 * Existing rows with a NULL tag (pre-migration) get one.
 */
async function upsertDemoUser(user: (typeof demoUsers)[number]) {
  const row = await prisma.user.upsert({
    where: { username: user.username },
    update: { ...user, lastPresence: 'online' },
    create: { ...user, lastPresence: 'online', userTagId: newTag() },
  });
  if (row.userTagId) return row;
  return prisma.user.update({
    where: { userId: row.userId },
    data: { userTagId: newTag() },
  });
}

const serverDefinitions = [
  {
    name: 'Nexus Demo Community',
    iconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&h=160&fit=crop',
    rooms: [
      { name: 'general', topic: 'A place for everyone to say hello.', type: 'TEXT' as const, capacity: 100 },
      { name: 'frontend', topic: 'React, TypeScript, and interface work.', type: 'TEXT' as const, capacity: 50 },
      { name: 'huddle', topic: 'Voice room for quick conversations.', type: 'VOICE' as const, capacity: 25 },
    ],
  },
  {
    name: 'Creative Studio',
    iconUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=160&h=160&fit=crop',
    rooms: [
      { name: 'design-critiques', topic: 'Share work, ask for feedback, improve together.', type: 'TEXT' as const, capacity: 80 },
      { name: 'inspiration', topic: 'Art, motion, typography, and visual references.', type: 'TEXT' as const, capacity: 80 },
      { name: 'studio-call', topic: 'Drop in for a collaborative creative session.', type: 'VOICE' as const, capacity: 20 },
    ],
  },
  {
    name: 'Night Shift Gamers',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=160&h=160&fit=crop',
    rooms: [
      { name: 'lfg', topic: 'Find teammates and plan your next session.', type: 'TEXT' as const, capacity: 150 },
      { name: 'clips-and-highlights', topic: 'Post your best plays and funniest moments.', type: 'TEXT' as const, capacity: 150 },
      { name: 'squad-room', topic: 'A voice room for the squad.', type: 'VOICE' as const, capacity: 30 },
    ],
  },
] as const;

async function main() {
  const [demoUser, demoFriend, demoModerator] = await Promise.all(demoUsers.map(upsertDemoUser));
  const members = [demoUser, demoFriend, demoModerator];
  const seededServers = [];

  for (const [serverIndex, definition] of serverDefinitions.entries()) {
    let guild = await prisma.guild.findFirst({ where: { name: definition.name } });
    guild = guild
      ? await prisma.guild.update({ where: { guildId: guild.guildId }, data: { iconUrl: definition.iconUrl } })
      : await prisma.guild.create({ data: { name: definition.name, iconUrl: definition.iconUrl, ownerId: members[serverIndex % members.length].userId } });

    for (const member of members) {
      await prisma.member.upsert({
        where: { guildId_userId: { guildId: guild.guildId, userId: member.userId } },
        update: {},
        create: { guildId: guild.guildId, userId: member.userId },
      });
    }

    const rooms = [];
    for (const [position, roomDefinition] of definition.rooms.entries()) {
      let room = await prisma.channel.findFirst({ where: { guildId: guild.guildId, name: roomDefinition.name } });
      room = room
        ? await prisma.channel.update({ where: { channelId: room.channelId }, data: { ...roomDefinition, position, icon: roomDefinition.type === 'VOICE' ? 'headset_mic' : 'tag' } })
        : await prisma.channel.create({ data: { guildId: guild.guildId, ...roomDefinition, position, icon: roomDefinition.type === 'VOICE' ? 'headset_mic' : 'tag' } });
      rooms.push(room);
    }

    await prisma.guild.update({ where: { guildId: guild.guildId }, data: { memberCount: members.length } });
    seededServers.push({ guild, rooms });
  }

  for (const [userId, friendId] of [[demoUser.userId, demoFriend.userId], [demoFriend.userId, demoUser.userId]]) {
    await prisma.friendship.upsert({
      where: { userId_friendId: { userId, friendId } }, update: {}, create: { userId, friendId },
    });
  }

  const samplesByRoom = [
    ['Welcome to the Nexus Demo Community!', 'This room is connected to PostgreSQL and the Gateway.', 'Try opening the app in two browser windows and send a message.'],
    ['Bring a draft to the next critique.', 'What are you designing this week?', 'The studio call is open whenever you need a second pair of eyes.'],
    ['Looking for a squad tonight.', 'Post your best clip here.', 'Voice lobby is ready when the team is assembled.'],
  ] as const;
  for (const [serverIndex, server] of seededServers.entries()) {
    const textRoom = server.rooms.find((room) => room.type === 'TEXT')!;
    for (const [sampleIndex, content] of samplesByRoom[serverIndex].entries()) {
      const authorId = members[sampleIndex % members.length].userId;
      const existing = await prisma.message.findFirst({ where: { channelId: textRoom.channelId, content } });
      if (!existing) await prisma.message.create({ data: { channelId: textRoom.channelId, authorId, content } });
    }
  }

  // ! DEV ONLY: prints secrets so curl tests work. Remove for any shared/prod seed.
  console.log(JSON.stringify({
    users: members.map((u) => ({ userId: u.userId.toString(), username: u.username, userTagId: u.userTagId })),
    friendId: demoFriend.userId.toString(),
    servers: seededServers.map(({ guild, rooms }) => ({ id: guild.guildId.toString(), name: guild.name, rooms: rooms.map((room) => ({ id: room.channelId.toString(), name: room.name, type: room.type })) })),
  }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());