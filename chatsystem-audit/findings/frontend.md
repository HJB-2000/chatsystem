# Front-end audit (commit e62e910e "connect the front and back")

Scope: front-end/ (vanilla) and front-end/react replacement/. Read-only. "RR" = react replacement.

## Contract table (React app -> backend)

| Frontend call (RR) | Backend endpoint/event | Status |
|---|---|---|
| chatApi.getUser GET /api/users/:id | AppController.user | OK |
| getCollectives GET /api/collectives?userId | collectives() | OK (types omit roomCount) |
| getRooms GET /api/collectives/:id/rooms?userId | rooms() | OK |
| getContacts GET /api/dms/:userId | dms() returns partnerId etc. | OK (shape unverified field by field) |
| getMessages GET /api/rooms/:id/messages?userId&limit&before | messages() -> {items,hasMore} | OK, but `before` never passed by UI (no pagination) |
| getMembers GET /api/rooms/:id/members?userId | members() | OK |
| sendMessage POST /api/rooms/:id/messages {senderId,message} | sendMessage() | OK, senderId is client-asserted (F-04) |
| joinRoom POST /api/rooms/:id/join | joinRoom() | OK in api layer, NEVER CALLED by UI |
| joinVoice/leaveVoice POST /api/channels/:id/(join|leave)-voice | joinVoice/leaveVoice | OK path; UI toggles `huddle` locally, ignores VOICE_STATE_UPDATE, no media (no WebRTC/SFU client) |
| WS connect ws://localhost:3001/gateway (hardcoded) | @WebSocketGateway path /gateway | OK path; ignores POST /api/gateway/url discovery (F-09) |
| op 10 HELLO -> op 2 IDENTIFY {token, last_message_id} | identify(): token must match /^\d+$/ and equals user id | OK, but "token" == userId (F-04) |
| op 1 heartbeat / op 11 ACK | onHeartbeat / onAck | OK |
| op 3 presence {status} | onPresence | OK (sent on tab visibility only) |
| op 8 typing {channel_id} | onTyping | OK, sendTyping defined, NEVER CALLED |
| MESSAGE_CREATE handler | payload: message_id, channel_id, author_id, author{id,username}, content, timestamp | OK mapping, but author.avatarUrl never sent; no channel filter (F-02) |
| PRESENCE_UPDATE handler | user_id, status | OK |
| READY {resync} | emitted | resync flag ignored (F-06) |
| TYPING_START, VOICE_STATE_UPDATE | emitted | no UI handler (missing) |
| Backend with no UI: PATCH users/:id, POST collectives, POST collectives/:id/rooms, POST collectives/:id/invites, POST invites/:token/join, PATCH/DELETE rooms/:r/messages/:m (edit/delete), GET/POST dms/:u/:p (DM history/send), PATCH dms/../read, POST friends/:u/:p, PATCH users/:id/presence | exist | Missing in RR. All were in the vanilla app. The "+" / DM / profile buttons open a placeholder dialog ("ready for database-backed fields") |
| UI elements with no backend: topbar search, Copilot, notifications, "Live Study Rooms" nav, file attachments (only appends "Attachment: name" text), Unsplash room images, reactions/pins/replies (vanilla only) | none | gap |

Mock data: RR no longer uses it (placeholders.js holds empty arrays + emoji list). Vanilla Api.js still silently falls back to mock.js on any fetch error (F-12).

## Findings

### F-01 HIGH bug/contract - env config never reaches the React app
RR/src/api/chatApi.ts:3-5, realtime/gatewayClient.ts:41-43, ui.jsx:6. Config is read from `globalThis.__NEXUS_CONFIG__`, which nothing defines (index.html has no script setting it; grep finds no definition). `VITE_API_URL`/`VITE_GATEWAY_URL`/`VITE_USER_ID` in integration-roadmap.md:46-48 are therefore ignored (Vite exposes them via `import.meta.env`, not globalThis). Result: URLs always fall back to hardcoded localhost:3000/3001, and the user id only works through `?userId=` in the URL.
Fix: use `import.meta.env.VITE_API_URL` etc. and delete the `__NEXUS_CONFIG__` indirection (or define it in index.html if runtime config is really wanted).

### F-02 HIGH bug - MESSAGE_CREATE appended to whatever room is open
RR/src/ui.jsx:417-421. The WS handler calls addMessage without checking `event.channel_id === room.id`, and the effect closure captures nothing about the current room. Any message in any joined channel/DM appears in the open room. Also the handler is registered once per user.id so a room filter must use a ref.
Fix: keep `roomRef.current = room` and `if (String(event.channel_id) !== roomRef.current?.id) return;` (optionally bump unread for others).

### F-03 HIGH bug - REST port collision / wrong default port (suspected)
.env:14,21 define only PORT=3001 (twice). apps/chatsystem/src/main.ts:10 uses `CHAT_PORT ?? PORT ?? 3000`, apps/gateway/src/main.ts:11 uses `GATEWAY_PORT ?? PORT ?? 3001`. Unless compose/shell sets CHAT_PORT, the REST API also binds 3001 and collides with the gateway. The front-end hardcodes REST on 3000. Not verified against docker-compose.
Fix: add `CHAT_PORT=3000` and `GATEWAY_PORT=3001` to .env and remove the duplicate keys.

### F-04 HIGH security - identity is client-asserted, no authentication
RR/ui.jsx:6,353; gatewayClient.ts:105; backend gateway session-loader.service.ts:14-24 ("token == user id"). Anyone can open `?userId=<any id>` (ids are small integers matching /^\d{1,19}$/) and read that user's DMs/rooms and post as them; REST sends `senderId`/`userId` in body/query with no Authorization header at all. No token is stored anywhere (no localStorage token), so there is no session to steal, but also no auth. Acceptable only for a school demo; must be stated.
Fix (minimum): a login endpoint issuing a signed token (JWT), send `Authorization: Bearer` on REST and in IDENTIFY, and derive userId server-side; drop senderId/userId from payloads.

### F-05 MED bug - reconnect backoff never resets; handler leaks on reconnect path
RR/realtime/gatewayClient.ts:67-100,123-127. `reconnectAttempt` is never reset to 0 on READY, so after a few drops every reconnect waits 15 s forever. `connect()` while a socket exists does not close the old one (only called once in practice; StrictMode double-mount is handled by cleanup disconnect, but `socket.onclose` of the old socket can still schedule a reconnect because `manuallyClosed` is reset by the second `connect()`: dev-mode double connection is plausible, suspected). Heartbeat ack (op 12) is ignored so a half-open socket is never detected client-side. Server close codes (AUTH_FAILED etc.) are not inspected: a bad userId reconnects in an infinite loop.
Fix: `this.reconnectAttempt = 0` on READY; stop retrying on auth-failure close codes; track last ack and reconnect if missed.

### F-06 MED bug - lastMessageId is global, resync ignored, replay can duplicate
gatewayClient.ts:51,111-115. One `last-message-id` in localStorage is shared across all channels and all users of the browser (switching `?userId=` replays against the wrong cursor). READY.resync=true (history truncated) is ignored, so after a long disconnect messages are silently missing. Dedup by id in addMessage (ui.jsx:346) protects against duplicates (good), but REST list and WS can still interleave out of order since messages are only appended, never sorted.
Fix: key the cursor by user id, refetch the room's history when `resync` is true, sort by createdAt/id on insert.

### F-07 MED bug - errors swallowed / not reported
gatewayClient.ts:93 `JSON.parse` in onmessage unguarded (throws inside the handler on a bad frame); `socket.onerror` only sets a status; ui.jsx:361-410 effects toast errors but the toast timer is never cleared (ui.jsx:342, leaks a timeout per toast and stacked toasts clear each other); `request()` chatApi.ts:12 hides non-JSON errors; Nest error body `message` may be an array.
Fix: try/catch the parse, keep a single toast timer in a ref, normalise `message` arrays.

### F-08 MED bug - stale/incorrect UI state
ui.jsx:382-399 `setRoom(null)` then effect on `room?.id` refetches on each server change; selecting a DM contact only opens a placeholder dialog (ui.jsx:~455) so DMs are unreachable even though `/api/dms/:u/:p` exists and getContacts is loaded; huddle toggle (ui.jsx:488) shows a live huddle bar with a fake `00:00` timer and "Leave" button that only flips local state without calling leaveVoice (ui.jsx:~470); `send()` toasts "Message sent" on every message; unsplash room images are fetched from the internet and keyed by index (ui.jsx:392); `count: memberCount` is guild-wide, not per room. No pagination UI although `before` is supported.

### F-09 LOW contract - gateway URL discovery unused
Backend exposes GET/POST /api/gateway/url (and .env GATEWAY_PUBLIC_URL) but RR hardcodes ws://localhost:3001/gateway. Fix: fetch it once at startup, fall back to the constant.

### F-10 MED security - vanilla: URL scheme/markup handling in render.js
front-end/render.js:3-5 `esc()` is correct and applied to names, room fields and message bodies before formatting, so stored XSS from message text is NOT present (verified formatContent escapes first, then re-adds tags from a fixed set; links only match `https?://`). Residual: render.js:21,81 interpolate `y[1]` (11 char `[\w-]` match, safe) and `style="${size}"` (internal). script.js:391 puts `e.message` through esc but the Retry button is concatenated inside the same string (fine). script.js:51-55 `f.name`/`id` unescaped but come from code constants. Verdict: no exploitable XSS found in vanilla; severity LOW, kept as a note. Avatar `src=${esc(user.avatarUrl)}` allows any URL (tracking pixel, no script execution).
Fix: none required; optionally restrict avatar URLs to https.

### F-11 LOW security - React renders messages as text
RR/ui.jsx:41 `{message.message}` is auto-escaped; no dangerouslySetInnerHTML/innerHTML in RR (grep clean). `<img src={user.avatarUrl}>` (ui.jsx:22) accepts arbitrary URLs from the backend (tracking only). No finding beyond that. Also: no CSP, third-party fonts via Google CDN.

### F-12 MED over-eng/hygiene - vanilla front-end silently falls back to mock data
front-end/Api.js:10-27: any network error or an HTML response flips a module-global `useMock=true` for the whole session and serves mock.js, so a dead backend looks like a working app (only a "Demo mode" toast, script.js:973). It also uses relative `/api/...` URLs (same-origin) so it only works behind a proxy; it never opens the websocket (no real-time at all in vanilla). Comment Api.js:36 ("backend needs PATCH/DELETE") is stale: the backend has them.
Fix: delete the vanilla app (see F-13) or remove the mock fallback.

### F-13 HIGH over-eng - two front-ends, a zip of the old one, committed build output
- front-end/ (vanilla: index.html 274, script.js 974, render.js 207, Api.js 64, mock.js 157) and RR coexist; RR is a rewrite with far fewer features (no edit/delete, DMs, invites, rooms creation, reactions, pins, replies, mentions, emoji picker wiring).
- front-end/files.zip (committed) is a byte-for-byte-ish archive of the vanilla app (7 files, 2026-10-10): dead duplicate.
- RR/src/react-handbook.pdf (2 MB) inside src/ is a committed doc, unrelated to the build.
- git tracks RR/node_modules (1514 files) and RR/dist (925 files) (`git ls-files`); root .gitignore is effectively empty, so any `npm install` produces a huge diff, and `dist/` goes stale.
- src/App.jsx is a one-line re-export of ui.jsx; ui.jsx is a 539-line monolith with mixed 4-space/2-space indentation (several components, the whole App) and `.jsx` importing `.ts` files with no tsconfig and no `typescript` dependency (works only because Vite transpiles; types are never checked). `api/types.ts` fields (Member.userId etc.) are unchecked.
Fix: pick one front-end (RR), delete vanilla + files.zip + handbook.pdf, `git rm -r --cached` node_modules and dist, add a .gitignore (node_modules, dist, .env), split ui.jsx into components/, either add tsconfig or rename .ts -> .js.

### F-14 MED hygiene - package.json / build sanity
RR/package.json: scripts dev/build/preview present (OK). Problems: every dependency is `"latest"` (@vitejs/plugin-react, react, react-dom, vite) so builds are non-reproducible (a lockfile exists, but `npm install` will not honour a moved "latest" without it); `@vitejs/plugin-react` and `vite` belong in devDependencies; `mdb-react-ui-kit` is listed but never imported (grep over src finds no use) - dead dependency; there is NO vite.config.js, so the React plugin is not registered (JSX still compiles through esbuild defaults with the automatic runtime in Vite >= 4, so it builds, but Fast Refresh is off - suspected) and no dev proxy; there is NO Tailwind in RR (no dependency, no config) - the Tailwind config lives only in the vanilla front-end/tailwind.config.js for the vanilla CDN build; RR uses a 45 KB hand-written styles.css. So "vite/tailwind consistency" is moot: tailwind is vanilla-only. index.html loads Google Fonts/Material Symbols from CDN (offline = missing icon text rendered as words). vite-env.d.ts is irrelevant without tsconfig. `.ts` imports use no extension while `.js`/`.jsx` do: inconsistent.
Fix: pin versions (`^`), move build tools to devDependencies, remove mdb-react-ui-kit, add a minimal vite.config.js with `react()` and `server.proxy` for /api, and set env via import.meta.env.

### F-15 LOW hygiene - hardcoded values and placeholders
Hardcoded: localhost:3000/3001 (chatApi.ts:5, gatewayClient.ts:43), unsplash photo ids (ui.jsx:392), sidebar link list and "Live Study Rooms" (ui.jsx:~37), `userTag '0000'` (ui.jsx:374), title "NexusCampus" while repo is "chatsystem", placeholders text "Waiting for profile data". Dead UI per the project's own roadmap: Copilot, notifications, top search, "More room actions" toast, Settings/Help links to `#`.

### F-16 LOW bug - Composer sends fake attachments
ui.jsx:55: attached files are turned into the text `Attachment: <name>` and posted as a message; the file is never uploaded (backend has no upload route). Misleading UI. Fix: remove the attach button until an upload endpoint exists.

### F-17 LOW bug - presence only from tab visibility
ui.jsx:427-431 sends idle/online on visibilitychange but the `useEffect` runs before the gateway exists in some orders (uses ref, so OK) and never sets initial status; PRESENCE_UPDATE only updates `members`, not the current user or DM contacts list.

## Counts
CRIT 0, HIGH 5 (F-01, F-02, F-03, F-04, F-13), MED 6 (F-05, F-06, F-07, F-08, F-12, F-14), LOW 6 (F-09, F-10, F-11, F-15, F-16, F-17) -> 17 findings. F-03 and the StrictMode part of F-05 are suspected, rest verified in code.
