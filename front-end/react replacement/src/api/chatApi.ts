import type { Collective, Contact, Member, Message, MessagePage, Room, User } from './types';

type RuntimeConfig = { VITE_API_URL?: string };
const runtimeEnv = (globalThis as typeof globalThis & { __NEXUS_CONFIG__?: RuntimeConfig }).__NEXUS_CONFIG__ ?? {};
const API_URL = runtimeEnv.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data as { message?: string } | null)?.message ?? `Request failed (${response.status})`);
  }
  return data as T;
}

const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });

export const chatApi = {
  getUser: (id: string) => request<User>(`/api/users/${encodeURIComponent(id)}`),
  getCollectives: (userId: string) => request<Collective[]>(`/api/collectives?userId=${encodeURIComponent(userId)}`),
  getRooms: (collectiveId: string, userId: string) => request<Room[]>(`/api/collectives/${collectiveId}/rooms?userId=${encodeURIComponent(userId)}`),
  getContacts: (userId: string) => request<Contact[]>(`/api/dms/${userId}`),
  getMessages: (roomId: string, userId: string, limit = 50, before?: string) => request<MessagePage>(`/api/rooms/${roomId}/messages?userId=${userId}&limit=${limit}${before ? `&before=${before}` : ''}`),
  getMembers: (roomId: string, userId: string) => request<Member[]>(`/api/rooms/${roomId}/members?userId=${userId}`),
  sendMessage: (roomId: string, senderId: string, message: string) => request<Message>(`/api/rooms/${roomId}/messages`, { ...json({ senderId, message }) }),
  joinRoom: (roomId: string, userId: string) => request<{ ok: boolean }>(`/api/rooms/${roomId}/join`, { ...json({ userId }) }),
  joinVoice: (roomId: string, userId: string) => request<{ ok: boolean; sfu: string }>(`/api/channels/${roomId}/join-voice`, { ...json({ userId }) }),
  leaveVoice: (roomId: string, userId: string) => request<{ ok: boolean }>(`/api/channels/${roomId}/leave-voice`, { ...json({ userId }) }),
};
