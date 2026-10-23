import type { Collective, Contact, Member, Message, MessagePage, Room, User } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const TAG_KEY = 'chatsystem.user-tag-id';

export const getUserTag = () => sessionStorage.getItem(TAG_KEY);
export const setUserTag = (tag: string | null) => tag ? sessionStorage.setItem(TAG_KEY, tag) : sessionStorage.removeItem(TAG_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userTagId = getUserTag();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(userTagId ? { 'x-user-tag': userTagId } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (data as { message?: string | string[] } | null)?.message;
    throw new Error(Array.isArray(message) ? message.join(', ') : message ?? `Request failed (${response.status})`);
  }
  return data as T;
}

const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });

export const chatApi = {
  getGatewayUrl: () => request<{ url: string }>('/api/gateway/url'),
  getUser: (id: string) => request<User>(`/api/users/${encodeURIComponent(id)}`),
  getCollectives: () => request<Collective[]>('/api/collectives'),
  getRooms: (collectiveId: string) => request<Room[]>(`/api/collectives/${collectiveId}/rooms`),
  getContacts: () => request<Contact[]>('/api/dms'),
  getMessages: (roomId: string, limit = 50, before?: string) => request<MessagePage>(`/api/rooms/${roomId}/messages?limit=${limit}${before ? `&before=${before}` : ''}`),
  getMembers: (roomId: string) => request<Member[]>(`/api/rooms/${roomId}/members`),
  sendMessage: (roomId: string, message: string) => request<Message>(`/api/rooms/${roomId}/messages`, { ...json({ message }) }),
  joinVoice: (roomId: string) => request<{ ok: boolean; sfu: string }>(`/api/channels/${roomId}/join-voice`, { ...json({}) }),
  leaveVoice: (roomId: string) => request<{ ok: boolean }>(`/api/channels/${roomId}/leave-voice`, { ...json({}) }),
  getDm: (partnerId: string) => request<Message[]>(`/api/dms/${partnerId}`),
  sendDm: (partnerId: string, message: string) => request<Message>(`/api/dms/${partnerId}`, { ...json({ message }) }),
};
