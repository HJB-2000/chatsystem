import { mockRequest } from './mock.js';

let useMock = false;
export const isMock = () => useMock;

async function request(url, options = {}) {
  if (useMock) return mockRequest(url, options);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    useMock = true; // network error: no backend
    return mockRequest(url, options);
  }

  if (response.status === 204) return null;

  const type = response.headers.get('content-type') || '';
  if (!type.includes('json')) {
    // static server answering /api with HTML: no backend
    if (response.ok || response.status === 404) {
      useMock = true;
      return mockRequest(url, options);
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
  return data;
}

const json = body => JSON.stringify(body);

export const getUsers = () => request('/api/users');
export const getUser = id => request(`/api/users/${id}`);
export const updateUser = (id, data) => request(`/api/users/${id}`, { method: 'PATCH', body: json(data) });

export const getCollectives = userId => request(`/api/collectives?userId=${userId}`);
export const createCollective = (userId, name) => request('/api/collectives', { method: 'POST', body: json({ userId, name }) });
export const getCollectiveRooms = (collectiveId, userId) => request(`/api/collectives/${collectiveId}/rooms?userId=${userId}`);
export const createCollectiveRoom = (collectiveId, data) => request(`/api/collectives/${collectiveId}/rooms`, { method: 'POST', body: json(data) });
export const createInvite = (collectiveId, userId) => request(`/api/collectives/${collectiveId}/invites`, { method: 'POST', body: json({ userId }) });
export const joinCollective = (token, userId) => request(`/api/invites/${encodeURIComponent(token)}/join`, { method: 'POST', body: json({ userId }) });

export const joinRoom = (roomId, userId) => request(`/api/rooms/${roomId}/join`, { method: 'POST', body: json({ userId }) });
export const getRoomMembers = (roomId, userId) => request(`/api/rooms/${roomId}/members?userId=${userId}`);
export const getRoomMessages = (roomId, userId, limit = 50) => request(`/api/rooms/${roomId}/messages?userId=${userId}&limit=${limit}`);
export const createRoomMessage = (roomId, senderId, message) => request(`/api/rooms/${roomId}/messages`, { method: 'POST', body: json({ senderId, message }) });

// New: backend needs PATCH/DELETE /api/rooms/:roomId/messages/:messageId
export const updateRoomMessage = (roomId, messageId, userId, message) =>
  request(`/api/rooms/${roomId}/messages/${messageId}`, { method: 'PATCH', body: json({ userId, message }) });
export const deleteRoomMessage = (roomId, messageId, userId) =>
  request(`/api/rooms/${roomId}/messages/${messageId}?userId=${userId}`, { method: 'DELETE' });

export const getDirectMessages = userId => request(`/api/dms/${userId}`);
export const getDirectMessageHistory = (userId, partnerId) => request(`/api/dms/${userId}/${partnerId}`);
export const sendDirectMessage = (userId, partnerId, message) => request(`/api/dms/${userId}/${partnerId}`, { method: 'POST', body: json({ message }) });
export const markDirectMessagesRead = (userId, partnerId) => request(`/api/dms/${userId}/${partnerId}/read`, { method: 'PATCH' });
