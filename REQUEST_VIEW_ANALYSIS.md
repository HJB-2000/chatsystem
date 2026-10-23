# ChatSystem Request View & Integration Analysis

## Executive Summary

This document provides a complete mapping of the ChatSystem backend API routes, frontend usage, database schema, and integration gaps between the React frontend replacement and the NestJS backend.

---

## Backend API Routes - Complete Reference

### Base Controller: `@Controller('api')`
**File:** `/home/jbahmida/ChatSystem/old-version/apps/chatsystem/src/app.controller.ts`

### 1. Gateway Configuration

#### GET/POST `/api/gateway/url`
- **Purpose:** Returns WebSocket gateway URL for realtime connection
- **Response:** `{ url: string }` (e.g., `ws://localhost:3001/gateway`)
- **Frontend Usage:** ❌ NOT USED (frontend has hardcoded gateway URL)
- **Service Method:** `gatewayUrl()` in chat.service.ts:662-666

---

### 2. User Management

#### GET `/api/users`
- **Purpose:** Get users (currently limited to caller only)
- **Auth:** Requires `x-user-tag` header
- **Response:** Array of users with `id`, `name`, `username`
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** `getUsers()` in chat.service.ts:69-76
- **Problem:** Only returns the authenticated user, not all users

#### GET `/api/users/:id`
- **Purpose:** Get specific user profile
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (user ID)
- **Response:** User object with profile details
- **Frontend Usage:** ✅ USED via `chatApi.getUser(id)`
- **Service Method:** `getUser()` in chat.service.ts:78-95
- **Security:** Only allows reading own profile (403 if trying to read another user)

#### PATCH `/api/users/:id`
- **Purpose:** Update user profile
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (user ID)
- **Body:** `{ name?, roleTitle?, currentActivity?, avatarUrl? }`
- **Response:** Updated user object
- **Frontend Usage:** ❌ NOT USED (frontend has no profile edit UI)
- **Service Method:** `updateUser()` in chat.service.ts:98-116
- **Security:** Only allows editing own profile

---

### 3. Presence Management

#### PATCH `/api/users/me/presence`
- **Purpose:** Set user presence status
- **Auth:** Requires `x-user-tag` header
- **Body:** `{ status: string }` (valid: 'online', 'idle', 'dnd')
- **Response:** `{ ok: true }`
- **Frontend Usage:** ❌ NOT USED via REST (uses Gateway instead)
- **Service Method:** `setPresence()` in chat.service.ts:469-483
- **Integration:** Publishes to Kafka topic `presence` for realtime distribution
- **Gateway Alternative:** Frontend uses `GatewayClient.sendPresence()` via WebSocket

---

### 4. Collectives (Guilds) Management

#### GET `/api/collectives`
- **Purpose:** Get all collectives user is a member of
- **Auth:** Requires `x-user-tag` header
- **Response:** Array of collectives with metadata
- **Frontend Usage:** ✅ USED via `chatApi.getCollectives()`
- **Service Method:** `getCollectives()` in chat.service.ts:150-178
- **Response Structure:**
  ```typescript
  {
    id: string;
    collectiveId: string;
    name: string;
    iconUrl?: string;
    ownerId: string;
    ownerName: string;
    memberCount: number;
    roomCount: number;
  }
  ```

#### POST `/api/collectives`
- **Purpose:** Create a new collective (guild)
- **Auth:** Requires `x-user-tag` header
- **Body:** `{ name: string }`
- **Response:** `{ id: string, name: string }`
- **Frontend Usage:** ❌ NOT USED (frontend has create button but not wired)
- **Service Method:** `createCollective()` in chat.service.ts:180-193
- **Side Effects:** Automatically creates owner as member and default "general" channel

#### GET `/api/collectives/:id/rooms`
- **Purpose:** Get all rooms/channels in a collective
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (collective ID)
- **Response:** Array of rooms with metadata
- **Frontend Usage:** ✅ USED via `chatApi.getRooms(collectiveId)`
- **Service Method:** `getCollectiveRooms()` in chat.service.ts:195-206
- **Security:** 403 if not a member of the collective
- **Response Structure:**
  ```typescript
  {
    id: string;
    channelId: string;
    collectiveId: string;
    name: string;
    topic: string;
    icon: string;
    type: 'TEXT' | 'VOICE';
    capacity: number;
    memberCount: number;
    messageCount: number;
    isMember: boolean;
    lastMessage?: string;
    lastActiveAt?: string;
  }
  ```

#### POST `/api/collectives/:id/rooms`
- **Purpose:** Create a new room/channel in a collective
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (collective ID)
- **Body:** `{ name: string, topic?: string, capacity?: number, icon?: string, type?: string }`
- **Response:** `{ id: string, name: string }`
- **Frontend Usage:** ❌ NOT USED (no room creation UI)
- **Service Method:** `createCollectiveRoom()` in chat.service.ts:208-230
- **Security:** 403 if not a member
- **Validation:** Name required, auto-converts to lowercase with hyphens

#### POST `/api/collectives/:id/invites`
- **Purpose:** Create an invite link for a collective
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (collective ID)
- **Response:** `{ token: string, collectiveId: string }`
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** `createInvite()` in chat.service.ts:260-268
- **Security:** 403 if not a member
- **Token Generation:** Random 6-byte base64url encoded token

#### POST `/api/invites/:token/join`
- **Purpose:** Join a collective via invite token
- **Auth:** Requires `x-user-tag` header
- **Params:** `token` (invite code)
- **Response:** `{ id: string, name: string }` (joined collective)
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** `joinByInvite()` in chat.service.ts:270-288
- **Behavior:** Idempotent - if already member, still returns collective info

---

### 5. Channel/Room Messages

#### GET `/api/rooms/:id/messages`
- **Purpose:** Get message history for a room
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (room/channel ID)
- **Query:** `limit` (default 50, max 100), `before` (message ID for pagination)
- **Response:** `{ items: Message[], hasMore: boolean }`
- **Frontend Usage:** ✅ USED via `chatApi.getMessages(roomId, limit, before)`
- **Service Method:** `getRoomMessages()` in chat.service.ts:318-338
- **Security:** 403 if not a member (or DM participant)
- **Pagination:** Returns messages in reverse chronological order (newest first)

#### GET `/api/channels/:id/messages`
- **Purpose:** Alias for room messages (alternative endpoint)
- **Auth:** Requires `x-user-tag` header
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** Same as `getRoomMessages()`

#### POST `/api/rooms/:id/messages`
- **Purpose:** Send a message to a room
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (room/channel ID)
- **Body:** `{ message?: string, content?: string }`
- **Response:** Created message object
- **Frontend Usage:** ✅ USED via `chatApi.sendMessage(roomId, message)`
- **Service Method:** `createRoomMessage()` in chat.service.ts:349-353
- **Validation:** Max 4000 characters, empty message rejected
- **Integration:** Publishes to Kafka topic `messages` for realtime distribution

#### POST `/api/channels/:id/messages`
- **Purpose:** Alias for sending messages (alternative endpoint)
- **Auth:** Requires `x-user-tag` header
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** Same as `createRoomMessage()`

#### PATCH `/api/rooms/:roomId/messages/:messageId`
- **Purpose:** Edit a message
- **Auth:** Requires `x-user-tag` header
- **Params:** `roomId`, `messageId`
- **Body:** `{ message: string }`
- **Response:** Updated message object
- **Frontend Usage:** ❌ NOT USED (no edit UI)
- **Service Method:** `editMessage()` in chat.service.ts:386-412
- **Security:** 403 if not the message author
- **Integration:** Publishes `MESSAGE_EDIT` event to Kafka

#### DELETE `/api/rooms/:roomId/messages/:messageId`
- **Purpose:** Delete a message
- **Auth:** Requires `x-user-tag` header
- **Params:** `roomId`, `messageId`
- **Response:** `{ ok: true, id: string }`
- **Frontend Usage:** ❌ NOT USED (no delete UI)
- **Service Method:** `deleteMessage()` in chat.service.ts:414-432
- **Security:** 403 if not the message author
- **Integration:** Publishes `MESSAGE_DELETE` event to Kafka

---

### 6. Room Members (Roster)

#### GET `/api/rooms/:id/members`
- **Purpose:** Get all members of a room's collective
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (room/channel ID)
- **Response:** Array of members with presence info
- **Frontend Usage:** ✅ USED via `chatApi.getMembers(roomId)`
- **Service Method:** `getRoomMembers()` in chat.service.ts:435-467
- **Response Structure:**
  ```typescript
  {
    id: string;
    userId: string;
    username: string;
    name: string;
    nickname?: string;
    avatarUrl?: string;
    roleTitle?: string;
    currentActivity?: string;
    status: string;
    inVoice: boolean;
    voiceChannelId?: string;
  }
  ```

---

### 7. Voice Signaling

#### POST `/api/channels/:id/join-voice`
- **Purpose:** Join a voice channel
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (channel ID)
- **Response:** `{ ok: true, sfu: string }` (SFU WebSocket URL)
- **Frontend Usage:** ✅ USED via `chatApi.joinVoice(roomId)`
- **Service Method:** `joinVoice()` in chat.service.ts:621-640
- **Validation:** Channel must be VOICE type, user must be member
- **Integration:** Publishes `VOICE_STATE_UPDATE` to Kafka topic `voice`
- **SFU URL:** From env var `SFU_URL` or default `wss://sfu.local.example/stream`

#### POST `/api/channels/:id/leave-voice`
- **Purpose:** Leave a voice channel
- **Auth:** Requires `x-user-tag` header
- **Params:** `id` (channel ID)
- **Response:** `{ ok: true }`
- **Frontend Usage:** ✅ USED via `chatApi.leaveVoice(roomId)`
- **Service Method:** `leaveVoice()` in chat.service.ts:642-660
- **Integration:** Publishes `VOICE_STATE_UPDATE` to Kafka

---

### 8. Direct Messages (DMs)

#### GET `/api/dms`
- **Purpose:** Get all DM conversations (friends)
- **Auth:** Requires `x-user-tag` header
- **Response:** Array of DM contacts with unread counts
- **Frontend Usage:** ✅ USED via `chatApi.getContacts()`
- **Service Method:** `getDirectMessages()` in chat.service.ts:486-534
- **Response Structure:**
  ```typescript
  {
    partnerId: string;
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    roleTitle?: string;
    status: string;
    channelId?: string;
    lastMessage?: string;
    lastActiveLabel: string;
    unreadCount: number;
  }
  ```

#### GET `/api/dms/:partnerId`
- **Purpose:** Get DM message history with a specific user
- **Auth:** Requires `x-user-tag` header
- **Params:** `partnerId` (public numeric user ID)
- **Response:** Array of messages
- **Frontend Usage:** ✅ USED via `chatApi.getDm(partnerId)`
- **Service Method:** `getDirectMessageHistory()` in chat.service.ts:536-550
- **Security:** 403 if not friends
- **Side Effect:** Automatically marks messages as read

#### POST `/api/dms/:partnerId`
- **Purpose:** Send a direct message
- **Auth:** Requires `x-user-tag` header
- **Params:** `partnerId` (public numeric user ID)
- **Body:** `{ message: string }`
- **Response:** Created message object
- **Frontend Usage:** ✅ USED via `chatApi.sendDm(partnerId, message)`
- **Service Method:** `sendDirectMessage()` in chat.service.ts:565-571
- **Security:** 403 if not friends
- **Behavior:** Auto-creates DM channel if it doesn't exist

#### PATCH `/api/dms/:partnerId/read`
- **Purpose:** Mark DM conversation as read
- **Auth:** Requires `x-user-tag` header
- **Params:** `partnerId` (public numeric user ID)
- **Response:** `{ ok: true }`
- **Frontend Usage:** ❌ NOT USED
- **Service Method:** `markDmRead()` in chat.service.ts:552-563
- **Security:** 403 if not friends

---

### 9. Friend Management (Internal Service Method)

#### `addFriend(userTagId, partnerId)`
- **Purpose:** Add a user as friend (creates bidirectional friendship)
- **Service Method:** `addFriend()` in chat.service.ts:600-618
- **Frontend Usage:** ❌ NOT EXPOSED via REST endpoint
- **Side Effects:** Creates DM channel automatically
- **Problem:** No REST endpoint exists for this functionality

---

## Database Schema Overview

**File:** `/home/jbahmida/ChatSystem/old-version/prisma/schema.prisma`

### Core Tables

#### User
- `userId` (BigInt, PK, autoincrement)
- `userTagId` (String, unique) - Secret authentication token
- `username` (String, unique)
- `avatarUrl` (String?)
- `roleTitle` (String?)
- `currentActivity` (String?)
- `lastPresence` (String?) - 'online' | 'idle' | 'dnd' | 'offline'
- Relations: guilds (owner), members, messages, friendships, dmChannels, invitesCreated

#### Guild (Collective)
- `guildId` (BigInt, PK, autoincrement)
- `name` (String)
- `iconUrl` (String?)
- `ownerId` (BigInt, FK to User)
- `memberCount` (Int, default 0)
- Relations: owner, channels, members, roles, invites

#### Channel (Room)
- `channelId` (BigInt, PK, autoincrement)
- `guildId` (BigInt, FK to Guild)
- `name` (String)
- `topic` (String?)
- `icon` (String?)
- `capacity` (Int, default 100)
- `type` (ChannelType: TEXT | VOICE | CATEGORY)
- `categoryId` (BigInt?, FK to Channel for categories)
- `position` (Int, default 0)
- Relations: guild, category, children, messages

#### Member
- `guildId` (BigInt, FK to Guild)
- `userId` (BigInt, FK to User)
- `nickname` (String?)
- `roleIds` (Json, default "[]")
- `joinedAt` (DateTime, default now)
- `voiceChannelId` (BigInt?) - Current voice channel
- Composite PK: [guildId, userId]
- Relations: guild, user

#### Message
- `messageId` (BigInt, PK, autoincrement)
- `channelId` (BigInt?, FK to Channel)
- `dmChannelId` (BigInt?, FK to DirectChannel)
- `authorId` (BigInt, FK to User)
- `content` (String)
- `embeds` (Json?)
- `attachments` (Json?)
- `createdAt` (DateTime, default now)
- `editedAt` (DateTime?)
- Relations: channel, dmChannel, author
- Indexes: [channelId, messageId], [dmChannelId, messageId]

#### Friendship
- `userId` (BigInt, FK to User)
- `friendId` (BigInt, FK to User)
- `createdAt` (DateTime, default now)
- Composite PK: [userId, friendId]
- Relations: user, friend

#### DirectChannel
- `channelId` (BigInt, PK, autoincrement)
- `userA` (BigInt)
- `userB` (BigInt)
- `createdAt` (DateTime, default now)
- Unique constraint: [userA, userB]
- Relations: members, messages

#### DirectChannelMember
- `channelId` (BigInt, FK to DirectChannel)
- `userId` (BigInt, FK to User)
- `lastReadMessageId` (BigInt?)
- Composite PK: [channelId, userId]
- Relations: channel, user

#### Invite
- `inviteId` (BigInt, PK, autoincrement)
- `guildId` (BigInt, FK to Guild)
- `code` (String, unique)
- `createdById` (BigInt, FK to User)
- `createdAt` (DateTime, default now)
- `expiresAt` (DateTime?)
- Relations: guild, createdBy

#### Role
- `roleId` (BigInt, PK, autoincrement)
- `guildId` (BigInt, FK to Guild)
- `name` (String)
- `permissions` (BigInt, default 0)
- `position` (Int, default 0)
- Relations: guild

---

## Frontend API Usage Analysis

**File:** `/home/jbahmida/ChatSystem/old-version/front-end/react replacement/src/api/chatApi.ts`

### Currently Implemented API Calls

| Method | Endpoint | Used | Implementation |
|--------|----------|------|----------------|
| GET | `/api/users/:id` | ✅ | `getUser(id)` |
| GET | `/api/collectives` | ✅ | `getCollectives()` |
| GET | `/api/collectives/:id/rooms` | ✅ | `getRooms(collectiveId)` |
| GET | `/api/dms` | ✅ | `getContacts()` |
| GET | `/api/rooms/:id/messages` | ✅ | `getMessages(roomId, limit, before)` |
| GET | `/api/rooms/:id/members` | ✅ | `getMembers(roomId)` |
| POST | `/api/rooms/:id/messages` | ✅ | `sendMessage(roomId, message)` |
| POST | `/api/channels/:id/join-voice` | ✅ | `joinVoice(roomId)` |
| POST | `/api/channels/:id/leave-voice` | ✅ | `leaveVoice(roomId)` |
| GET | `/api/dms/:partnerId` | ✅ | `getDm(partnerId)` |
| POST | `/api/dms/:partnerId` | ✅ | `sendDm(partnerId, message)` |

### Backend Routes NOT Used by Frontend

| Method | Endpoint | Purpose | Why Not Used |
|--------|----------|---------|-------------|
| GET/POST | `/api/gateway/url` | Get gateway URL | Frontend uses hardcoded URL |
| GET | `/api/users` | Get users list | Only returns authenticated user |
| PATCH | `/api/users/:id` | Update user profile | No profile edit UI |
| PATCH | `/api/users/me/presence` | Set presence | Uses Gateway instead |
| POST | `/api/collectives` | Create collective | Create button not wired |
| POST | `/api/collectives/:id/rooms` | Create room | No room creation UI |
| POST | `/api/collectives/:id/invites` | Create invite | No invite UI |
| POST | `/api/invites/:token/join` | Join via invite | No invite join UI |
| GET | `/api/channels/:id/messages` | Alias endpoint | Uses `/api/rooms` instead |
| POST | `/api/channels/:id/messages` | Alias endpoint | Uses `/api/rooms` instead |
| PATCH | `/api/rooms/:roomId/messages/:messageId` | Edit message | No edit UI |
| DELETE | `/api/rooms/:roomId/messages/:messageId` | Delete message | No delete UI |
| PATCH | `/api/dms/:partnerId/read` | Mark DM read | Not implemented |

### Missing Backend Endpoints

| Functionality | Description | Impact |
|---------------|-------------|--------|
| Add Friend | No REST endpoint for `addFriend()` | Cannot add friends via UI |
| Delete Friend | No endpoint to remove friendships | Cannot unfriend users |
| Typing Indicators | REST endpoints don't handle typing | Only via Gateway |
| Message Search | No search endpoint | Client-side filtering only |
| Message Reactions | No reaction endpoints | No reactions feature |
| Thread Replies | No threading endpoints | No threaded conversations |
| File Uploads | No attachment upload endpoints | Attachments not functional |
| Notifications | No notification endpoints | No notification system |

---

## Frontend Realtime (Gateway) Integration

**File:** `/home/jbahmida/ChatSystem/old-version/front-end/react replacement/src/realtime/gatewayClient.ts`

### Gateway Protocol Implementation

#### Connection Sequence
1. Open WebSocket to `VITE_GATEWAY_URL` (default: `ws://localhost:3001/gateway`)
2. Receive `HELLO` (op: 10) with heartbeat interval
3. Send `IDENTIFY` (op: 2) with `user_tag_id` and optional `last_message_id`
4. Receive `READY` (op: 0, t: 'READY')
5. Start heartbeat interval

#### Supported Gateway Events

| Event Type | Handler | Purpose |
|------------|---------|---------|
| READY | Auto-handled | Connection established |
| MESSAGE_CREATE | ✅ Implemented | New message received |
| MESSAGE_UPDATE | ✅ Implemented | Message edited |
| MESSAGE_DELETE | ✅ Implemented | Message deleted |
| PRESENCE_UPDATE | ✅ Implemented | User presence changed |
| TYPING_START | ❌ Not handled | Typing indicator |
| VOICE_STATE_UPDATE | ❌ Not handled | Voice state changes |

#### Gateway Client Methods

| Method | Implemented | Usage |
|--------|-------------|-------|
| `connect(token)` | ✅ | Start connection |
| `disconnect()` | ✅ | Close connection |
| `sendPresence(status)` | ✅ | Send presence update |
| `sendTyping(channelId)` | ✅ | Send typing indicator |
| `acknowledge(channelId, messageId)` | ✅ | Acknowledge message receipt |
| `on(event, handler)` | ✅ | Subscribe to events |
| `onStatus(handler)` | ✅ | Monitor connection status |

#### Frontend Gateway Usage in ui.jsx

```javascript
// Lines 433-454 in ui.jsx
useEffect(() => {
  if (!user.id) return undefined;
  const gateway = new GatewayClient();
  gatewayRef.current = gateway;
  
  // Status monitoring
  const removeStatus = gateway.onStatus(setConnectionStatus);
  
  // Message events
  const removeMessage = gateway.on('MESSAGE_CREATE', event => {
    if (String(event.channel_id) !== String(roomRef.current?.id)) return;
    addMessage({...});
  });
  
  // Message edit
  const removeUpdate = gateway.on('MESSAGE_UPDATE', event => {...});
  
  // Message delete
  const removeDelete = gateway.on('MESSAGE_DELETE', event => {...});
  
  // Presence updates
  const removePresence = gateway.on('PRESENCE_UPDATE', event => {...});
  
  gateway.connect(getUserTag() ?? '');
  return () => { /* cleanup */ };
}, [user.id]);
```

#### Presence Auto-Update

```javascript
// Lines 456-460 in ui.jsx
useEffect(() => {
  const handleVisibility = () => 
    gatewayRef.current?.sendPresence(document.hidden ? 'idle' : 'online');
  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, []);
```

---

## Integration Problems & Migration Blockers

### 1. Authentication Mismatch

**Problem:**
- Backend expects `x-user-tag` header with a secret `userTagId` from database
- Frontend uses this correctly via `getUserTag()` from sessionStorage
- However, there's no login/registration flow to obtain a valid `userTagId`

**Impact:**
- Users cannot authenticate without manual database insertion of `userTagId`
- No user registration endpoint exists
- No password-based authentication

**Solution Required:**
- Implement user registration endpoint
- Implement login endpoint returning `userTagId` or JWT
- Add login UI to frontend
- Update Gateway to use JWT instead of raw `userTagId`

---

### 2. Missing Data Seeding

**Problem:**
- Database has no users with `userTagId` set
- Frontend requires valid `userTagId` to authenticate
- No seed data or migration scripts

**Impact:**
- Frontend cannot connect without pre-existing database users
- Development requires manual database setup

**Solution Required:**
- Create seed script to generate test users with `userTagId`
- Document database setup process
- Add environment variable for test user credentials

---

### 3. Gateway URL Configuration

**Problem:**
- Backend provides `/api/gateway/url` endpoint
- Frontend ignores this and uses hardcoded `VITE_GATEWAY_URL`
- No dynamic gateway URL resolution

**Impact:**
- Configuration changes require frontend rebuild
- Cannot support multiple environments easily

**Solution Required:**
- Call `/api/gateway/url` on startup
- Use returned URL for Gateway connection
- Fallback to environment variable if endpoint fails

---

### 4. Missing UI Features

**Problem:**
- Backend provides many endpoints not wired to UI:
  - Create collective
  - Create room
  - Create/join invites
  - Edit/delete messages
  - Update user profile
  - Add friends

**Impact:**
- Users cannot perform basic management tasks
- System is read-only for most operations

**Solution Required:**
- Add modal/dialog for creating collectives
- Add room creation form
- Add invite generation and join UI
- Add message context menu with edit/delete
- Add profile settings panel
- Add friend request system

---

### 5. No Error Handling

**Problem:**
- Frontend has basic toast notifications
- No retry logic for failed requests
- No offline handling
- No loading states for most operations

**Impact:**
- Poor user experience on network issues
- No indication of operation failures
- Data inconsistency on partial failures

**Solution Required:**
- Implement proper error boundaries
- Add retry logic with exponential backoff
- Add optimistic UI updates
- Add loading spinners for async operations
- Add offline detection and queueing

---

### 6. Type Mismatches

**Problem:**
- Backend returns BigInt as strings (safely converted)
- Frontend types don't always match backend responses
- Some fields have different names (e.g., `collectiveId` vs `id`)

**Impact:**
- Runtime type errors possible
- Missing data in UI
- Confusion between similar fields

**Solution Required:**
- Create shared TypeScript types in a separate package
- Add API response validation (zod or similar)
- Normalize field names in API layer
- Document all type mappings

---

### 7. Message Deduplication

**Problem:**
- When sending a message, both REST response and Gateway event return it
- Frontend has basic deduplication by ID
- Race conditions possible

**Impact:**
- Duplicate messages in UI
- Message ordering issues
- State inconsistency

**Solution Required:**
- Implement proper deduplication in state management
- Use message IDs as keys in React
- Consider using Redux or Zustand for centralized state
- Add message ID to optimistic updates

---

### 8. Pagination Not Implemented

**Problem:**
- Backend supports `limit` and `before` query params for pagination
- Frontend passes `limit` but never uses `before`
- No "load more" functionality

**Impact:**
- Only loads first 50 messages
- Cannot see historical messages
- Poor performance for large channels

**Solution Required:**
- Implement infinite scroll or "load more" button
- Track last message ID
- Call API with `before` parameter on scroll
- Merge new messages with existing ones

---

### 9. No Message Persistence on Navigation

**Problem:**
- Messages only loaded when room selected
- Navigating away and back re-fetches all messages
- No local caching

**Impact:**
- Slow navigation
- Unnecessary API calls
- Poor UX on slow connections

**Solution Required:**
- Implement message caching in state
- Cache messages per room
- Only fetch new messages on room switch
- Consider localStorage or IndexedDB for persistence

---

### 10. Voice Not Functional

**Problem:**
- Voice endpoints exist but only update database state
- No actual WebRTC implementation
- SFU URL is placeholder
- No audio permissions handling

**Impact:**
- Voice button changes state but no audio
- Users think voice is broken
- Cannot test voice features

**Solution Required:**
- Implement WebRTC peer connection
- Integrate with real SFU (e.g., LiveKit, Jitsi)
- Add microphone permission handling
- Add audio visualizer
- Handle mute/deafen states

---

### 11. Presence Sync Issues

**Problem:**
- Presence updated via Gateway events
- But members list fetched via REST and not updated by Gateway
- Stale member status in roster

**Impact:**
- Member status not live
- Incorrect online/offline indicators
- No typing indicators

**Solution Required:**
- Update member state on PRESENCE_UPDATE events
- Add typing indicator handling
- Refresh members list periodically
- Show last seen timestamp

---

### 12. No Search Functionality

**Problem:**
- Search bar exists in UI but only filters client-side
- No backend search endpoint
- Cannot search across channels
- No message search

**Impact:**
- Search only works for loaded messages
- Cannot find historical messages
- Poor UX for large channels

**Solution Required:**
- Implement backend search endpoint
- Add full-text search (PostgreSQL tsvector)
- Add search across channels
- Add user search
- Implement search pagination

---

### 13. No Notification System

**Problem:**
- No unread message tracking (except DMs)
- No mention detection
- No notification endpoints
- No push notifications

**Impact:**
- Users miss messages
- No @mention alerts
- Poor engagement

**Solution Required:**
- Implement unread tracking per channel
- Add mention detection and highlighting
- Add notification endpoints
- Consider browser notifications API
- Add notification settings

---

### 14. File Uploads Not Supported

**Problem:**
- Composer has file attachment UI
- But no backend upload endpoint
- Attachments field in database not used
- Files just appended as text "Attachment: filename"

**Impact:**
- Cannot share files
- Misleading UI
- Data loss if user thinks files uploaded

**Solution Required:**
- Implement file upload endpoint
- Add file storage (S3, local, etc.)
- Generate file URLs
- Add file preview in messages
- Handle file size limits

---

### 15. Environment Configuration

**Problem:**
- Frontend requires `VITE_API_URL` and `VITE_GATEWAY_URL`
- No example .env file
- Hardcoded fallbacks may not match backend
- CORS issues possible

**Impact:**
- Frontend may not connect to backend
- Configuration errors in production
- Difficult to set up for new developers

**Solution Required:**
- Add .env.example file
- Document environment variables
- Add CORS configuration to backend
- Add health check endpoint
- Add configuration validation

---

## Request Lifecycle Examples

### Example 1: User Connects and Loads Collectives

```
Frontend → REST: GET /api/gateway/url
Frontend ← REST: { url: "ws://localhost:3001/gateway" }

Frontend → REST: GET /api/collectives
  Headers: { x-user-tag: "abc123..." }
Backend → AuthCheck: validate userTagId
Backend → Database: SELECT * FROM guild WHERE guildId IN (user's guilds)
Backend ← Database: guild rows
Frontend ← REST: [{ id, name, iconUrl, ... }]

Frontend → Gateway: WebSocket connect to ws://localhost:3001/gateway
Frontend → Gateway: { op: 2, d: { user_tag_id: "abc123..." } }
Gateway → AuthCheck: validate userTagId
Gateway → Redis: store session
Frontend ← Gateway: { op: 0, t: "READY" }
Frontend → Gateway: start heartbeat interval
```

**Potential Issues:**
- `/api/gateway/url` not called by frontend
- No error handling if userTagId invalid
- No retry on Gateway connection failure

---

### Example 2: User Sends a Message

```
Frontend → REST: POST /api/rooms/:roomId/messages
  Headers: { x-user-tag: "abc123..." }
  Body: { message: "Hello world" }
Backend → AuthCheck: validate userTagId → userId
Backend → Database: Check membership in channel's guild
Backend → Database: INSERT INTO message (channelId, authorId, content, ...)
Backend ← Database: new message row
Backend → Kafka: publish to topic "messages", key: "channel:roomId"
  Payload: { channel_id, message_id, author_id, content, timestamp }
Frontend ← REST: { id, channelId, senderId, senderName, message, createdAt, ... }

Gateway ← Kafka: consume message event
Gateway → Redis: update last message ID
Gateway → WebSocket: broadcast to all subscribers in channel
  { op: 0, t: "MESSAGE_CREATE", d: { message_id, channel_id, author, content, ... } }
Frontend ← Gateway: MESSAGE_CREATE event
Frontend → UI: Add message to state (deduplicate by ID)
```

**Potential Issues:**
- Duplicate message from REST response and Gateway event
- No error handling if message insert fails
- Kafka event may arrive before REST response
- No offline handling - message lost if sent while disconnected

---

### Example 3: User Joins Voice Channel

```
Frontend → REST: POST /api/channels/:channelId/join-voice
  Headers: { x-user-tag: "abc123..." }
Backend → AuthCheck: validate userTagId → userId
Backend → Database: SELECT * FROM channel WHERE channelId = :channelId
Backend → Validation: channel.type === 'VOICE'
Backend → Database: Check membership in channel's guild
Backend → Database: UPDATE member SET voiceChannelId = :channelId WHERE userId = :userId
Backend → Kafka: publish to topic "voice", key: "guild:guildId"
  Payload: { user_id, channel_id, guild_id, action: "join", ... }
Frontend ← REST: { ok: true, sfu: "wss://sfu.local.example/stream" }

Gateway ← Kafka: consume voice state event
Gateway → WebSocket: broadcast to guild subscribers
  { op: 0, t: "VOICE_STATE_UPDATE", d: { user_id, channel_id, action, ... } }
Frontend ← Gateway: VOICE_STATE_UPDATE event
Frontend → UI: Update member voice status

Frontend → SFU: WebSocket connect to wss://sfu.local.example/stream
Frontend → SFU: WebRTC offer/answer exchange
Frontend → SFU: ICE candidates exchange
Frontend → UI: Start audio stream
```

**Potential Issues:**
- SFU URL is placeholder
- No actual WebRTC implementation
- No audio permission handling
- No error handling if SFU unavailable
- Voice state updates not handled by frontend

---

### Example 4: User Updates Presence

```
Frontend → Gateway: { op: 3, d: { status: "online" } }
Gateway → AuthCheck: validate userTagId
Gateway → Redis: update presence state
Gateway → Kafka: publish to topic "presence", key: "user:userId"
  Payload: { user_id, status, timestamp }
Gateway → WebSocket: broadcast to relevant subscribers
  { op: 0, t: "PRESENCE_UPDATE", d: { user_id, status, timestamp } }

Backend ← Kafka: consume presence event (optional, for persistence)
Backend → Database: UPDATE user SET lastPresence = :status WHERE userId = :userId

Frontend ← Gateway: PRESENCE_UPDATE event
Frontend → UI: Update member status in roster
```

**Potential Issues:**
- Backend doesn't consume presence events (only publishes)
- Presence not persisted to database
- No "last seen" tracking
- Frontend doesn't handle own presence updates

---

### Example 5: User Loads DM History

```
Frontend → REST: GET /api/dms/:partnerId
  Headers: { x-user-tag: "abc123..." }
Backend → AuthCheck: validate userTagId → userId
Backend → Database: SELECT * FROM friendship WHERE userId = :userId AND friendId = :partnerId
Backend → Validation: friendship exists (403 if not)
Backend → Database: Get or create DM channel for user pair
Backend → Database: SELECT * FROM message WHERE dmChannelId = :channelId ORDER BY messageId ASC LIMIT 200
Backend → Database: UPDATE directChannelMember SET lastReadMessageId = :lastId WHERE userId = :userId
Frontend ← REST: [{ id, senderId, senderName, message, createdAt, ... }]

Frontend → UI: Display messages
Frontend → UI: Update unread count to 0
```

**Potential Issues:**
- DM channel auto-created even if no messages
- No pagination for DM history (hardcoded 200)
- Unread count not updated in contacts list
- No error if users not friends

---

## Recommended Integration Steps

### Phase 1: Critical Foundation (Blockers)

1. **Add Seed Data**
   - Create script to generate test users with `userTagId`
   - Add test collectives, rooms, and messages
   - Document database setup

2. **Fix Environment Configuration**
   - Add `.env.example` to frontend
   - Document all required variables
   - Add configuration validation

3. **Implement Error Handling**
   - Add try-catch to all API calls
   - Add retry logic with exponential backoff
   - Add user-friendly error messages
   - Add loading states

4. **Add Gateway URL Resolution**
   - Call `/api/gateway/url` on startup
   - Use returned URL for connection
   - Fallback to environment variable

### Phase 2: Core Functionality

5. **Implement Message Deduplication**
   - Use normalized state management
   - Add ID-based deduplication
   - Handle race conditions

6. **Add Pagination**
   - Implement "load more" button
   - Track last message ID
   - Merge paginated results

7. **Add Message Caching**
   - Cache messages per room in state
   - Only fetch new messages on switch
   - Consider persistence

8. **Fix Presence Sync**
   - Update member state on Gateway events
   - Add typing indicators
   - Refresh roster periodically

### Phase 3: Missing Features

9. **Add Create Collective UI**
   - Modal dialog with name input
   - Call POST /api/collectives
   - Refresh collectives list
   - Auto-select new collective

10. **Add Create Room UI**
    - Form with name, topic, type, capacity
    - Call POST /api/collectives/:id/rooms
    - Refresh rooms list
    - Auto-select new room

11. **Add Invite System**
    - Generate invite button
    - Display invite code/link
    - Join via invite dialog
    - Handle invite errors

12. **Add Message Edit/Delete**
    - Context menu on messages
    - Edit dialog
    - Delete confirmation
    - Update UI on Gateway events

13. **Add Profile Settings**
    - Settings panel with name, avatar, activity
    - Call PATCH /api/users/:id
    - Update UI immediately
    - Handle upload for avatar

14. **Add Friend System**
    - Create backend endpoint for addFriend
    - Add friend request UI
    - Show friend status
    - Allow unfriending

### Phase 4: Enhanced Features

15. **Implement Search**
    - Backend search endpoint
    - Full-text search
    - Search across channels
    - Search pagination

16. **Add Notifications**
    - Unread tracking per channel
    - Mention detection
    - Notification endpoints
    - Browser notifications

17. **Implement File Uploads**
    - Upload endpoint
    - File storage
    - Preview in messages
    - File size limits

18. **Add Authentication**
    - Registration endpoint
    - Login endpoint
    - JWT tokens
    - Refresh tokens

### Phase 5: Voice & Advanced

19. **Implement Voice**
    - Real SFU integration
    - WebRTC implementation
    - Audio permissions
    - Mute/deafen UI

20. **Add Typing Indicators**
    - Gateway event handling
    - UI display
    - Auto-expire

21. **Add Message Reactions**
    - Backend endpoints
    - UI for reactions
    - Realtime updates

22. **Add Thread Replies**
    - Backend threading
    - Thread UI
    - Collapse/expand

---

## Database Migration & Seeding

### Required Seed Data

```sql
-- Test users with userTagId
INSERT INTO user (username, user_tag_id, role_title, current_activity, last_presence)
VALUES
  ('testuser1', 'test-tag-id-12345678', 'Developer', 'Coding', 'online'),
  ('testuser2', 'test-tag-id-87654321', 'Designer', 'Designing', 'idle'),
  ('testuser3', 'test-tag-id-abcdef12', 'Manager', 'Planning', 'dnd');

-- Test collective
INSERT INTO guild (name, icon_url, owner_id, member_count)
VALUES
  ('Test Collective', 'https://example.com/icon.png', 1, 3);

-- Test members
INSERT INTO member (guild_id, user_id, joined_at)
VALUES
  (1, 1, NOW()),
  (1, 2, NOW()),
  (1, 3, NOW());

-- Test rooms
INSERT INTO channel (guild_id, name, topic, type, capacity, position)
VALUES
  (1, 'general', 'General discussion', 'TEXT', 100, 0),
  (1, 'random', 'Random chat', 'TEXT', 100, 1),
  (1, 'voice-general', 'Voice channel', 'VOICE', 10, 2);

-- Test messages
INSERT INTO message (channel_id, author_id, content, created_at)
VALUES
  (1, 1, 'Welcome to the collective!', NOW()),
  (1, 2, 'Thanks for having us!', NOW()),
  (1, 3, 'Looking forward to collaborating!', NOW());

-- Test friendships
INSERT INTO friendship (user_id, friend_id, created_at)
VALUES
  (1, 2, NOW()),
  (1, 3, NOW()),
  (2, 3, NOW());
```

---

## Security Considerations

### Current Security Issues

1. **Weak Authentication**
   - `userTagId` is a simple string hash
   - No password-based auth
   - No token expiration
   - No refresh mechanism

2. **Client-Side Trust**
   - Some operations trust client-provided IDs
   - No server-side validation for all fields
   - Potential for IDOR (Insecure Direct Object Reference)

3. **No Rate Limiting**
   - No rate limits on API endpoints
   - Vulnerable to spam/abuse
   - No DDoS protection

4. **No Input Sanitization**
   - Message content not sanitized
   - Potential XSS attacks
   - No HTML escaping

5. **No CSRF Protection**
   - No CSRF tokens
   - Vulnerable to cross-site request forgery

### Recommended Security Improvements

1. **Implement JWT Authentication**
   - Replace `userTagId` with JWT
   - Add access token expiration
   - Implement refresh tokens
   - Add token revocation

2. **Add Rate Limiting**
   - Per-user rate limits
   - Per-endpoint limits
   - IP-based limits
   - Use Redis for tracking

3. **Input Validation & Sanitization**
   - Validate all inputs
   - Sanitize message content
   - Escape HTML in responses
   - Length limits on all fields

4. **Add CSRF Protection**
   - CSRF tokens for state-changing operations
   - SameSite cookie attributes
   - Origin validation

5. **Add Authorization**
   - Role-based permissions
   - Per-channel permissions
   - Admin/moderator roles
   - Permission checks on all operations

---

## Performance Considerations

### Current Performance Issues

1. **N+1 Queries**
   - `getCollectives()` queries channels for each guild
   - Should use joins or batch loading

2. **No Connection Pooling**
   - Prisma may not have optimized connection pool
   - Could cause connection exhaustion

3. **Large Message Fetches**
   - Fetching 200 messages for DMs may be slow
   - No lazy loading

4. **No Caching**
   - No Redis caching for frequently accessed data
   - Every request hits database

5. **No Index Optimization**
   - Some queries may not use optimal indexes
   - Need to analyze query patterns

### Recommended Performance Improvements

1. **Add Redis Caching**
   - Cache user data
   - Cache collective metadata
   - Cache room lists
   - TTL-based invalidation

2. **Optimize Database Queries**
   - Use includes/joins instead of N+1
   - Add selective field loading
   - Add query result caching

3. **Implement Pagination**
   - Cursor-based pagination
   - Limit default page sizes
   - Add pagination to all list endpoints

4. **Add Database Indexes**
   - Analyze slow queries
   - Add composite indexes
   - Monitor index usage

5. **Implement Read Replicas**
   - Separate read/write databases
   - Route read queries to replicas
   - Improve scalability

---

## Monitoring & Observability

### Missing Monitoring

1. **No Logging**
   - No structured logging
   - No request logging
   - No error tracking

2. **No Metrics**
   - No request metrics
   - No performance metrics
   - No business metrics

3. **No Tracing**
   - No distributed tracing
   - No request correlation
   - No performance profiling

4. **No Health Checks**
   - No health endpoint
   - No readiness checks
   - No dependency health checks

### Recommended Monitoring

1. **Add Structured Logging**
   - Use Winston or Pino
   - Log all requests
   - Log errors with stack traces
   - Correlation IDs

2. **Add Metrics**
   - Prometheus metrics
   - Request latency
   - Error rates
   - Active connections

3. **Add Tracing**
   - OpenTelemetry
   - Distributed tracing
   - Request correlation
   - Performance profiling

4. **Add Health Checks**
   - `/health` endpoint
   - Database connectivity
   - Kafka connectivity
   - Redis connectivity

---

## Conclusion

The ChatSystem backend provides a comprehensive API for chat functionality, but the React frontend replacement only implements a subset of the available endpoints. Several critical issues prevent full integration:

### Critical Blockers
1. No authentication/registration flow
2. No seed data for testing
3. Missing UI for core features (create, edit, delete)
4. No error handling or retry logic
5. Gateway URL not dynamically resolved

### Functional Gaps
1. Missing create collective/room UI
2. Missing invite system
3. Missing message edit/delete
4. Missing profile settings
5. Missing friend management
6. No search functionality
7. No notifications
8. No file uploads
9. Voice not functional

### Technical Debt
1. Poor error handling
2. No pagination implementation
3. No message caching
4. Type mismatches
5. Presence sync issues
6. No offline handling

### Security & Performance
1. Weak authentication
2. No rate limiting
3. No input sanitization
4. No CSRF protection
5. N+1 query issues
6. No caching layer
7. No monitoring

To achieve full integration, follow the recommended phases in order, addressing critical blockers first, then implementing missing features, and finally enhancing security, performance, and observability.
