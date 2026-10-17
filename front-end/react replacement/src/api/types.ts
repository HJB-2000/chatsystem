export type User = {
  id: string;
  username: string;
  name?: string;
  userTag?: string;
  roleTitle?: string | null;
  currentActivity?: string | null;
  avatarUrl?: string | null;
  status?: string;
};

export type Collective = {
  id: string;
  name: string;
  iconUrl?: string | null;
  memberCount?: number;
};

export type Room = {
  id: string;
  name: string;
  topic?: string | null;
  type?: string;
  icon?: string;
  memberCount?: number;
  capacity?: number;
  collectiveId?: string;
};

export type Message = {
  id: string;
  channelId?: string;
  senderId: string;
  senderName: string;
  avatarUrl?: string | null;
  message: string;
  createdAt: string;
  editedAt?: string | null;
};

export type Contact = User & {
  partnerId: string;
  channelId: string;
  lastMessage?: string | null;
  lastActiveLabel?: string;
  unreadCount?: number;
};

export type Member = User & {
  userId: string;
  nickname?: string | null;
  inVoice?: boolean;
  voiceChannelId?: string;
};

export type MessagePage = { items: Message[]; hasMore: boolean };
