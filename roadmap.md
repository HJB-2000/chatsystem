# ChatSystem Integration Roadmap (Simplified)

**Goal**: Create a functional chat app with Discord-like theme - NOT a full Discord clone. Focus on essential features only.

## Current State

### Backend ✅
- Complete REST API for users, collectives, rooms, messages, DMs, presence
- Kafka-based real-time events
- PostgreSQL with Prisma
- Gateway WebSocket support

### Frontend ⚠️
- Discord-themed React UI
- Partial API integration
- Gateway client implemented
- Missing: create collective/room, message edit/delete, pagination

---

## Essential Tasks (What You Actually Need)

### Task 1: Connect Authentication & Load User Data
- [x] Verify `userTagId` auth works (already in place)
- [ ] Call `GET /api/users/:id` to load current user profile
- [ ] Display username, avatar, role in UI
- [ ] Add `PATCH /api/users/:id` to update profile (optional - can skip for MVP)

### Task 2: Load Real Collectives & Rooms
- [ ] Replace mock data with `GET /api/collectives`
- [ ] On collective select, call `GET /api/collectives/:id/rooms`
- [ ] Display rooms with name, topic, type
- [ ] **Result**: User sees their real servers and channels

### Task 3: Send & Receive Messages
- [ ] On room select, call `GET /api/rooms/:id/messages`
- [ ] Wire composer to `POST /api/rooms/:id/messages`
- [ ] Ensure Gateway `MESSAGE_CREATE` events append messages
- [ ] Handle deduplication (REST response + Gateway event)
- [ ] **Result**: Users can chat in real-time

### Task 4: Create Collectives & Rooms
- [ ] Add `POST /api/collectives` to chatApi.ts
- [ ] Add simple dialog to create collective (name input)
- [ ] Add `POST /api/collectives/:id/rooms` to chatApi.ts
- [ ] Add dialog to create room (name, topic)
- [ ] **Result**: Users can create their own servers and channels

### Task 5: Basic Presence
- [ ] Call `GET /api/rooms/:id/members` when room is selected
- [ ] Display members in roster
- [ ] Handle `PRESENCE_UPDATE` events from Gateway
- [ ] **Result**: Users can see who's online

### Task 6: Direct Messages (Optional - Skip if not needed)
- [ ] Verify `GET /api/dms` loads contacts
- [ ] On contact select, call `GET /api/dms/:partnerId`
- [ ] Wire composer to `POST /api/dms/:partnerId`
- [ ] **Result**: 1-on-1 messaging works

---

## Skip These (Not Essential for MVP)

❌ Voice chat (requires SFU, complex WebRTC)
❌ Invite system (can manually add users to DB for testing)
❌ Message edit/delete (basic CRUD is enough)
❌ Message pagination (load last 50 messages is fine)
❌ Friend system (use existing DB friendships or skip)
❌ JWT auth overhaul (userTagId is fine for internal app)
❌ Advanced security (not needed for internal use)
❌ Production hardening (keep it simple)

---

## Implementation Order

1. **Task 1**: Auth & user profile (30 min)
2. **Task 2**: Load collectives & rooms (1 hour)
3. **Task 3**: Send/receive messages (2 hours)
4. **Task 4**: Create collectives & rooms (2 hours)
5. **Task 5**: Basic presence (1 hour)
6. **Task 6**: DMs (optional, 1-2 hours)

**Total time**: ~6-8 hours for a working app

---

## Quick Start Guide

### Step 1: Update chatApi.ts
Add the missing endpoints:
```typescript
createCollective: (name: string) => request<{id: string; name: string}>('/api/collectives', { ...json({ name }) }),
createRoom: (collectiveId: string, data: {name: string; topic?: string}) => request<{id: string; name: string}>(`/api/collectives/${collectiveId}/rooms`, { ...json(data) }),
updateUser: (id: string, data: any) => request<User>(`/api/users/${id}`, { method: 'PATCH', ...json(data) }),
```

### Step 2: Update ui.jsx
- Replace mock data with API calls in useEffect hooks
- Add dialogs for creating collectives/rooms
- Ensure Gateway events update state

### Step 3: Test
- Start backend: `npm run start:dev`
- Start frontend: `cd "front-end/react replacement" && npm run dev`
- Open browser, enter userTagId, test messaging

---

## Success Criteria (MVP)

✅ User can authenticate with userTagId
✅ User sees their real collectives and rooms
✅ User can send and receive messages in real-time
✅ User can create new collectives and rooms
✅ User can see other members in the room
✅ Discord-like theme is maintained

That's it. Everything else is optional polish.

---

## Notes

- Keep the current `userTagId` auth - it's fine for internal use
- Don't worry about voice for now
- Don't implement invites - just add users directly to DB if needed
- Focus on getting the core chat loop working first
- The backend is already complete, just need to wire it up
