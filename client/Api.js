async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.error || `HTTP ${response.status}`);

    return data;
}

export async function getUsers() {
    return request('/api/users');
}

export async function getUser(id) {
    return request(`/api/users/${id}`);
}

export async function updateUser(id, data) {
    return request(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

export async function getCollectives(userId) {
    return request(`/api/collectives?userId=${userId}`);
}

export async function createCollective(userId, name) {
    return request('/api/collectives', {
        method: 'POST',
        body: JSON.stringify({ userId, name })
    });
}

export async function getCollectiveRooms(collectiveId, userId) {
    return request(
        `/api/collectives/${collectiveId}/rooms?userId=${userId}`
    );
}

export async function createCollectiveRoom(collectiveId, data) {
    return request(`/api/collectives/${collectiveId}/rooms`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function createInvite(collectiveId, userId) {
    return request(`/api/collectives/${collectiveId}/invites`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
}

export async function joinRoom(roomId, userId) {
    return request(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
}

export async function getRoomMembers(roomId, userId) {
    return request(`/api/rooms/${roomId}/members?userId=${userId}`);
}

export async function getRoomMessages(roomId, userId, limit = 50) {
    return request(
        `/api/rooms/${roomId}/messages?userId=${userId}&limit=${limit}`
    );
}

export async function createRoomMessage(roomId, senderId, message) {
    return request(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ senderId, message })
    });
}

export async function getDirectMessages(userId) {
    return request(`/api/dms/${userId}`);
}

export async function getDirectMessageHistory(userId, partnerId) {
    return request(`/api/dms/${userId}/${partnerId}`);
}

export async function sendDirectMessage(userId, partnerId, message) {
    return request(`/api/dms/${userId}/${partnerId}`, {
        method: 'POST',
        body: JSON.stringify({ message })
    });
}

export async function markDirectMessagesRead(userId, partnerId) {
    return request(`/api/dms/${userId}/${partnerId}/read`, {
        method: 'PATCH'
    });
}

export async function joinCollective(token, userId) {
    return request(`/api/invites/${token}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
}