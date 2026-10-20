# Part B — ft_transcendence Subject Compliance

Subject version 21.2. Repo: `/home/mushigarou/AI_Lab/chatsystem` at `e62e910e`. Scope: the chat system only.

Method: I read the whole subject and `REPORT.md`, then re-checked status claims against the repo. Everything marked "runtime" comes from the earlier audit run. I did not re-run it, and the React app was never clicked through in a browser. Items I could not verify are marked Unknown or "not browser-tested".

## Summary

| | Points |
|---|---|
| **Credible NOW (fully functional only)** | **about 3** (Framework major 2 + ORM minor 1). Both depend on the team's app being React + NestJS and running cleanly in Chrome, which nobody has checked. |
| **After the MVP blueprint (P0–P5)** | **about 7–8 chat-owned**: WebSockets real-time 2 + basic chat/profile/friends 2 + frameworks 2 + ORM 1, plus voice as a Module of choice (1) and microservices (2, shared). Stretch: advanced chat 1, organization system 2. |
| Needed | 14 for the team, from the 4 people together. The chat owner cannot reach 14 alone. |

**Biggest risks**
1. **Rejection risk on the mandatory part.** The subject says "If you don't follow them, your project will be rejected." Right now the chat repo has no Dockerfiles and no single-command deployment. It has no HTTPS, and no Privacy Policy or Terms of Service. `.env` is committed and `.gitignore` is broken. There is no `.env.example`, and the README is the unmodified Nest template. Several of these are team-level, but the chat repo fails them today.
2. **90% done = 0 points.** The subject says "Non-functional or incomplete modules = 0 points." These are close but still score zero:
   - Real-time: DMs never arrive live, edit/delete arrive as new messages, and membership is frozen at connect.
   - Basic chat: there is no remove-friend, no profile UI, and no way to create a room or guild in React.
   - Voice: it is currently a fake button.
3. **No authentication.** Identity is a number the client supplies. The evaluator's first move, spoofing another user, succeeds with one `curl`. This also blocks "Standard user management", which belongs to the auth teammate.
4. **Dependency on teammates.** Auth (JWT), HTTPS or a reverse proxy, and one shared compose file all come from others. Without them none of the chat modules can be demonstrated properly.
5. **Advanced chat.** Two of its six bullets need a game, and nobody has said a game exists.

## 1. Mandatory requirements matrix

Legend: Chat-owned = the chat owner must deliver it. Team-level = one team deliverable. Status: Met / Partial / Missing / Unknown (team).

### General requirements (III.2) and preamble

| Requirement (quoted short) | Applies | Status | Evidence | What to do |
|---|---|---|---|---|
| "web application, and requires a frontend, backend, and a database" | Team-level; chat supplies all three | Partial | React (Vite), NestJS (`apps/chatsystem`, `apps/gateway`), Postgres (`prisma/schema.prisma`). Builds and boots (audit). | Merge into the team app, or make sure the chat is reachable from the team's front end. |
| "Git … clear and meaningful commit messages … Commits from all team members … Proper work distribution" | Team-level | Unknown (team) | In this repo: 10 commits by "Jassim Bahmida", 6 by "futex" and 3 by "qwen.ai[bot]". Messages are weak ("fix all the problems in the front, but the design is not complet"). | Commit under your own identity. Use meaningful messages. Show your own commits in the team repo. Remove the bot as a co-author. |
| "Deployment must use a containerization solution … and run with a single command" | Team-level; chat-owned part is the apps | **Missing** | No `Dockerfile*` anywhere (`find` of the working tree, 0 hits). Only `infra/postgres/docker-compose.yml` exists, with postgres, redis and kafka (lines 2, 21, 33). The apps run from host Node. | P0: write a Dockerfile for each app (chatsystem, gateway, and the voice signaling if kept). Add them and the front end to one compose file. `docker compose up --build` must start everything. |
| "compatible with the latest stable version of Google Chrome" | Chat-owned (front end) | Unknown | React app was built (`vite build` passes) but never opened in a browser. | P3/P5: manual pass in Chrome. |
| "No warnings or errors about the Javascript code … in the browser console" | Chat-owned (front end) | Unknown | Not tested. Likely issues: unguarded `JSON.parse` (`gatewayClient.ts:61`), failed requests while the backend is down, the CORS flood from a different origin. | P5: open DevTools on every flow and fix everything, including React warnings. Dependencies are `latest`, so pin them. |
| "accessible Privacy Policy and Terms of Service pages with relevant content" | Team-level (one page set) | **Missing** | No such page or file in the repo (`git ls-files` outside `node_modules` shows none). | Add `/privacy` and `/terms` pages and footer links, with real content. Describe the data the chat stores (messages, presence, usernames). The auth teammate should state what they store too. Coordinate so there is one page. Missing pages are listed as a rejection reason. |
| "Multi-user Support … simultaneously … No data corruption or race conditions" | Chat-owned | Partial | Live delivery to a second client works (audit step 7e). Known races: `getOrCreateDm` check-then-create with no transaction (`chat.service.ts:461-478`). Presence is split between DB and Redis. | P2: transaction plus unique-violation handling. One source of truth for presence. Test with two browsers. |
| "Real-time updates are reflected across all connected users when applicable" | Chat-owned | Partial | Works for guild channels only. DMs not live (`session-loader.service.ts:54-58`). New channels or guilds get nothing until reconnect. Edits and deletes show up as new messages (`events.consumer.ts:19-31`). | P2. See the real-time module below. |
| "Team roles … PO, PM, Tech Lead, Developers … documented in README.md" | Team-level | Unknown (team) | README is the Nest template. | Team README. Four people can combine roles. The chat owner supplies a short "role + responsibilities + contributions" entry. |

### Technical requirements (III.3)

| Requirement | Applies | Status | Evidence | What to do |
|---|---|---|---|---|
| "A frontend that is clear, responsive, and accessible across all devices" | Chat-owned (chat UI) | Partial | Custom `styles.css`, one monolith `ui.jsx` (539 lines). A few `aria-label`s, tabs with `role`. Not tested on small screens. Fake UI (Copilot, search, notifications) is present. | P3: test on a phone-width viewport. Remove fake controls. Fix labels and keyboard use. |
| "A CSS framework or styling solution of your choice" | Chat-owned | Met | Plain CSS in `front-end/react replacement/src/styles.css`. Custom CSS counts as a "styling solution". | Mention it in the README. |
| "credentials … in a local .env file that is ignored by Git, and provide an .env.example file" | Team-level; chat repo fails | **Missing** | `.env` is tracked (`git ls-files`). `.gitignore` contains the text `(empty)` and ignores nothing. The only example is `infra/postgres/env.example`, which is not a root `.env.example`. The password is already in git history. | P0: `git rm --cached .env`, rotate the password, add a real `.gitignore`, add root `.env.example` with every variable (including the JWT secret). |
| "The database must have a clear schema and well-defined relations" | Chat-owned | Partial | `prisma/schema.prisma` has User, Guild, Channel, Member, Message, Friendship, Invite, DirectChannel, DirectChannelMember. Relations exist with cascades. `Role` is unused. Two FKs on `message.channel_id` drifted from the migration (`schema.prisma:111-112` vs migration `20261009053621_init`). No user email or password column. | P2: squash migrations, fix the drift. Add the auth columns together with the teammate. Drop unused tables. Document the schema in the README. |
| "basic user management … sign up and log in securely: email and password … hashed passwords, salted" | Auth teammate | Missing in this repo | `User` has no email or `passwordHash` (`schema.prisma:20-36`). `argon2` and `@nestjs/jwt` are installed but never imported. | Auth teammate's job. Chat consumes their JWT and uses the user id from the token (P1). Agree on the shared user table or service early. |
| "All forms and user inputs must be properly validated in both the frontend and backend" | Chat-owned | Partial | Backend: manual checks only (name trim, 4000-char limit in `createRoomMessage`). No `ValidationPipe`. Bad input gives 500 (`/users/abc`, empty body). `dto.ts` is imported by nothing. Frontend: little visible validation. | P2: DTOs plus a global `ValidationPipe`, 400 and 404 responses. Frontend limits (length, empty) on message, room name and profile forms. |
| "Any connection to the backend … must use HTTPS" | Team-level (reverse proxy); chat must work behind it | **Missing** | Plain `http://localhost:3000` and `ws://localhost:3001/gateway`. Endpoints hardcoded in the React client (`gatewayClient.ts:10`, `chatApi.ts:3-5`). | P0: one TLS terminator in the team's compose (nginx or caddy). The chat uses `wss://`. Read URLs from `VITE_*` env, not hardcoded. Fix CORS and the `Origin` check for the new origin. |
| Framework definition (React and NestJS count) | Chat-owned | Met | React + Vite; NestJS 12. | None. Pin versions (they are `latest`). |
| Passwords hashed, XSS and SQL injection (security expectations) | Chat-owned partly | Partial | Prisma queries are parameterized (audit B-31). No XSS found in React or vanilla (audit F-10/F-11); React escapes text by default, and no `dangerouslySetInnerHTML` in `ui.jsx`. No auth, no password storage here. | Keep rendering messages as plain text. Add rate limits and a WebSocket `maxPayload` (P0-5). |
| Secrets not in repo | Chat-owned | **Missing** | `.env` tracked, DB password in history. Postgres, Redis and Kafka published on all interfaces. | P0 (see the `.env` row). Bind ports to `127.0.0.1`. |
| README requirements (VI) | Team-level | **Missing** | `README.md` is the Nest template. | Needs: first line in italics ("This project has been created as part of the 42 curriculum by …"), Description, Instructions, Resources (including how AI was used), Team Information, Project Management, Technical Stack, Database Schema, Features List, Modules (points), Individual Contributions. In English. Supply your section with the chat parts. |
| "Only the work inside your repository will be evaluated" and "brief modification … may be requested" | Team-level | Unknown | The chat must live in the team's repo. | Merge or submodule into the team repo. Be able to change a function live (e.g. message length rule, a new event) without breaking. |
| Repo hygiene (supports Git, `.env` and "commits" rules) | Chat-owned | **Missing** | 34,566 `node_modules` files, `dist/`, generated Prisma client tracked. Stray files (`.backend.md.swp`, `some_test.*`, `tmp.md`, `files.zip`). | P0/P1: the untrack commands from the audit's section 7. |

AI rule: the subject (chapter I) says you must be able to explain any AI-generated code during peer evaluation. The commit history shows a bot co-author, so be ready to explain every file, especially the gateway state code.

## 2. Module matrix

Points per the subject: Major = 2, Minor = 1. 14 points needed. Bonus counts only past 14, capped at 5.

| Module (exact name) | Type, pts | Subject criteria (short) | Owner | Status now | Gap, blueprint phase | Dependencies |
|---|---|---|---|---|---|---|
| Web: "Major: Use a framework for both the frontend and backend." | Major, 2 | Frontend framework (React…) and backend framework (NestJS…) | Shared (counts once for the team) | **Satisfied** for chat parts, provided Chrome runs cleanly | P5: Chrome pass. Pin versions. All teammates should use the same stack, or the evaluator sees a mixed picture. | None |
| Web: "Minor: Use a frontend framework" / "Minor: Use a backend framework" | Minor, 1 each | Same, separately | Shared | Alternative only | Do not claim these in addition to the Major above. | Replaced by the Major |
| Web: "Major: Implement real-time features using WebSockets or similar technology." | Major, 2 | Real-time updates across clients; handle connection/disconnection gracefully; efficient message broadcasting | Chat | **Near**. Missing: DMs not live (B-02), edit/delete as creates (B-05), frozen membership (B-03), no room filter in UI (F-02), reconnect counter never reset (F-05), no resync on reconnect, no auth on WS | P2 (gateway fixes) and P3 (client handling) | None |
| Web: "Major: Allow users to interact with other users." | Major, 2 | "basic chat system (send/receive messages between users)"; "profile system (view user information)"; "friends system (add/remove friends, see friends list)" | Chat (chat + friends), with the auth teammate (profile data) | **Near**. Send/receive works in guild rooms, not DMs; add-friend exists in API only (`app.controller.ts:190`); remove-friend does not exist; no React UI for DMs, friends or profile | P2 (remove-friend, DM fix) and P3 (UI: DM screen, friends list, profile view). Needs P1 so users are real. | Required by Advanced chat. Profile/friends data overlaps Standard user management. |
| Web: "Minor: Use an ORM for the database." | Minor, 1 | ORM | Shared | **Satisfied** (Prisma, `prisma/schema.prisma`, migrations apply, seed runs) | Clean the migrations (P2). | None |
| Web: "Minor: A complete notification system for all creation, update, and deletion actions." | Minor, 1 | Notifications for create/update/delete | Shared | Not started (a "Notifications" button is fake UI) | Not recommended | Needs wide coverage across everyone's features |
| Web: "Minor: File upload and management system." | Minor, 1 | Multiple types, client and server validation, secure storage with access control, preview, progress, delete | Chat could own | Not started (attachments are turned into text, `ui.jsx:254`) | Stretch only; large for 1 point | Avatar upload belongs to user management |
| Web: "Minor: Implement advanced search functionality with filters, sorting, and pagination." | Minor, 1 | Search + filters + sorting + pagination | Chat could own | Not started (topbar search is fake) | Stretch: message search with `before` pagination partly exists in the API (`app.controller.ts:86`) | None |
| Web: "Major: A public API to interact with the database with a secured API key, rate limiting, documentation, and at least 5 endpoints" | Major, 2 | API key, rate limit, docs, 5+ endpoints | Not chat | Not started (routes exist but no key, no limit, no docs) | Do not claim | None |
| Web: "Minor: Real-time collaborative features" / "SSR" / "PWA" / "Custom-made design system" | Minor, 1 each | See subject | Other | Not started | Do not claim. A design system needs 10 reusable components; `ui.jsx` is a monolith. | None |
| Accessibility: "Major: Complete accessibility compliance (WCAG 2.1 AA)…" | Major, 2 | Screen reader, keyboard, assistive tech | Team | Not started | Do not claim | None |
| Accessibility: "Minor: Support for multiple languages (at least 3 languages)" and "Minor: Right-to-left (RTL) language support" and "Minor: Support for additional browsers" | Minor, 1 each | i18n with switcher; RTL layout mirroring; 2 extra browsers | Team | Not started (all text hardcoded, `lang="en"`) | Leave to the team unless someone owns the front end | None |
| User Management: "Major: Standard user management and authentication." | Major, 2 | Update profile; upload avatar (default if none); add friends and see online status; profile page | Auth teammate (chat supplies friends and presence) | Not started in this repo (no auth, no avatar upload; `avatarUrl` is a string only, `schema.prisma:23`; presence exists but is split) | P1 (JWT), P3 (UI). Chat must hand over: friends list + presence. | Overlaps "Allow users to interact" |
| User Management: "Minor: Implement remote authentication with OAuth 2.0" | Minor, 1 | OAuth with Google/GitHub/42 | Auth teammate | Not chat | None for chat | None |
| User Management: "Major: Advanced permissions system" | Major, 2 | CRUD users, roles (admin, moderator…), views by role | Chat could own part | Not started (`Role` table unused; no checks) | Stretch: could be shared with auth | Needs auth |
| User Management: "Major: An organization system" | Major, 2 | Create/edit/delete organizations; add and remove users; view; actions (create, read, update) | Chat could own (guilds = organizations) | Started. Guild create and invite-join exist in the API only; no edit, delete, leave or kick (audit P2-13) and no React UI. Whether an evaluator accepts a chat guild as an "organization" is uncertain. | Stretch after P3: add edit/delete guild, leave and kick, plus UI | Needs auth |
| User Management: "Minor: Implement a complete 2FA" / "Minor: User activity analytics" / "Minor: Game statistics and match history" | Minor, 1 each | See subject | Other | Not chat | Not chat. Game statistics require a game. | Game |
| AI: "Minor: Voice/speech integration for accessibility or interaction." | Minor, 1 | Voice/speech for accessibility or interaction | Chat (borderline) | Not started (voice is a stub; `chat.service.ts:501-519` flips a DB flag) | A WebRTC call is not obviously "speech integration". Safer to present voice under Modules of choice. | None |
| AI: "Minor: Content moderation AI" / "Minor: Sentiment analysis" etc. | Minor/Major | AI features | Other | Not started | Do not claim | None |
| Cybersecurity: "Major: Implement WAF/ModSecurity (hardened) + HashiCorp Vault for secrets" | Major, 2 | ModSecurity + Vault | Devops teammate | Not started | Not chat | None |
| Gaming: "Minor: Advanced chat features (enhances the basic chat from 'User interaction' module)." | Minor, 1 | Block users; invite users to play games from chat; game/tournament notifications in chat; access to profiles from chat; chat history persistence; typing indicators and read receipts | Chat | **Started**. History persistence: backend yes. Typing: gateway handles it (`gateway.ts:206`) but no UI sends or shows it. Read receipts: endpoint returns `{ok:true}` and does nothing (`app.controller.ts:185-188`). Block: absent. Profile from chat: no UI. Game items: no game. | P3 plus later work. Only after the basic chat module is truly done. | **Requires** the basic chat module. Two bullets require a game; today no game is known. |
| Gaming: games, tournaments, customization, spectator, etc. | Major/Minor | Need a game | Other teammates | Not chat | None. Chat only touches them via invites and notifications. | Game |
| Devops: "Major: Backend as microservices." | Major, 2 | "loosely-coupled services with clear interfaces"; "REST APIs or message queues for communication"; "single responsibility" | Shared (counts once for the team); chat provides 2 services | **Near / Started**. chatsystem (REST writes) and gateway (WS) talk through Kafka (a message queue). Weak points: gateway reads Postgres directly, so the DB is shared; Kafka publish failure silently drops delivery (`kafka.service.ts:22-30`); the voice service is a stub; the other teammates' services are unknown | P2, P4 (voice signaling as a real service). Document each service's single responsibility and its interface. | Needs auth as its own service or at least a clear interface to count well |
| Devops: "Major: Infrastructure for log management using ELK" / "Major: Monitoring system with Prometheus and Grafana" / "Minor: Health check and status page system…" | Major/Minor | See subject | Devops teammate (likely) | Not started | Not chat | None |
| Data: "Major: Advanced analytics dashboard", "Minor: Data export and import", "Minor: GDPR compliance features" | Major/Minor | See subject | Other | Not started | Do not claim | None |
| Blockchain modules | Major/Minor | Tournament scores; ICP backend | Other | Not chat | None | Game |
| Modules of choice: "Major: Implement a custom module that is not listed above." / "Minor: Same as the major module but smaller in scope" | Major 2 / Minor 1 | Substantial, with README justification (why, challenges, value, why Major) | Chat | Not started (voice is the candidate) | P4: WebRTC voice with a signaling relay. Claim it as the Minor first; claim it as Major only if the team can defend the extra scope in the README. | Needs the chat running with real users |

Notes on the table:
- The subject has no module literally called "voice chat" or "video". The only voice-related entries are "Voice/speech integration" (AI) and the Modules of choice. This is a risk to confirm with the evaluator or staff.
- Docker, HTTPS and the privacy pages are mandatory, so they earn no points.

## 3. Points ledger (chat-owned work)

| Module | Pts | Claimable NOW | After MVP (P0–P5) | Stretch | Counts once for the team? Who demos |
|---|---|---|---|---|---|
| Major: Use a framework for both the frontend and backend | 2 | 2 (caveat: Chrome, console) | 2 | | Yes. Whoever knows the stack; the chat owner can demo the Nest + React parts |
| Minor: Use an ORM for the database | 1 | 1 | 1 | | Yes. Chat owner demos the Prisma schema and migrations |
| Major: Implement real-time features using WebSockets or similar technology | 2 | 0 | 2 | | Chat owner demos two browsers live |
| Major: Allow users to interact with other users | 2 | 0 | 2 | | Chat owner demos chat; the auth teammate demos profile data. Agree who shows what |
| Minor of choice: WebRTC voice channels (justified in README) | 1 | 0 | 1 | up to 2 as Major if defensible | Chat owner |
| Major: Backend as microservices | 2 | 0 | 2 (only if the team's services also hold up) | | Yes; Tech Lead demos, chat owner explains chatsystem + gateway + Kafka |
| Minor: Advanced chat features | 1 | 0 | 0 | 1 (if no game, ask the staff first) | Chat owner |
| Major: An organization system | 2 | 0 | 0 | 2 (uncertain fit) | Chat owner |
| **Total** | | **3** | **about 8–10 depending on shared items** | up to +3 | |

Honest reading of the "after MVP" column: frameworks 2 + ORM 1 + real-time 2 + interact 2 = 7 firm. Add voice 1 = 8. Add microservices 2 = 10 if the whole team's services qualify. The figure of about 7–8 chat-owned in the summary leaves microservices out because it needs the other teammates.

Shared modules count once for the team. If two people claim the same module, the points are not doubled. Decide up front who stands in front of the evaluator for each.

## 4. Evaluation-day risks (current result against the chat)

| Evaluator action | Current result | Why |
|---|---|---|
| Spoof another user (`POST /api/rooms/1/messages {"senderId":"3"}`, `PATCH /api/users/1` without credentials) | **FAIL** | Returned 201 and 200 in the audit. Identity is body-supplied (`app.controller.ts:106-116`). |
| Read someone else's DMs | **FAIL** | Both ids come from the URL (`app.controller.ts:166-183`). |
| WebSocket IDENTIFY with someone else's id as token | **FAIL** | "token == user id" (`session-loader.service.ts:14-25`). |
| Two browsers, two users, message appears live | **Partial**. Passes for guild rooms (audit step 7e, Kafka → gateway → WS, using a script, not a browser). Not verified in the UI. | |
| Two browsers, DM live | **FAIL** | DMs not indexed (`session-loader.service.ts:54-58`). React cannot open the DM screen (`ui.jsx:472`). |
| Create a guild or room, other user sees it | **FAIL** | No UI; membership frozen at connect. |
| Edit or delete a message | **FAIL** | No UI; backend events arrive as `MESSAGE_CREATE`. |
| Reload the page and see history | **Likely pass** for the selected room (`GET /rooms/:id/messages`); not browser-tested. Resync on reconnect is ignored. | |
| Kill the network, reconnect | **Partial**. A reconnect loop exists but the delay never resets (`gatewayClient.ts:18, :93`) and there is no resync. | |
| Open the browser console | **Unknown**. Probably warnings or errors. | |
| Open over HTTPS | **FAIL** | Only `http://` and `ws://`. |
| Run one command to start everything | **FAIL** | No Dockerfiles; compose has infra only. |
| Check Privacy Policy and Terms | **FAIL** | None exist. |
| Check `.env` in git | **FAIL** | Tracked, with a password. |
| Try SQL injection or XSS in a message | **Likely pass** | Prisma parameterizes; React escapes. Not re-tested. |
| Send an empty or 5000-char message, bad ids | **FAIL** for bad ids (500s); the 4000-char limit exists. |
| Voice call between two users | **FAIL** | Fake button and fake `00:00` timer (`ui.jsx:214-216`). |
| Explain the architecture and Kafka choice | Depends on you | Be ready to justify Kafka and the two-service split. |
| "Brief modification" in the code | Depends on you | `chat.service.ts` is 547 lines and `ui.jsx` 539 lines in one file. Know where the send and receive paths are. |

## 5. Recommendations

**Claim (priority = points per effort)**
1. **Frameworks (Major, 2) and ORM (Minor, 1).** Almost free. You already have them. Only the Chrome and console cleanliness remain.
2. **Real-time WebSockets (Major, 2).** The core path already works. The work is a bounded list: DM indexing, edit/delete events, lazy membership, room filter, reconnect reset, auth on the socket.
3. **Allow users to interact (Major, 2).** Backend mostly exists. You need remove-friend, a profile view, a DM screen and a friends list in React. Agree with the auth teammate who supplies the profile fields.
4. **Voice as Modules of choice (Minor, 1).** Claim it as a Minor first. Write the README justification (why, challenge, value). Mesh WebRTC with signaling through the gateway is a defensible Minor. Only argue Major if you add something clearly harder.
5. **Backend as microservices (Major, 2), as the team's claim.** Your chatsystem + gateway + queue is a good part of it. It only counts if the other services are also separate with clear interfaces. Ask the Tech Lead.

**Leave to teammates**
- Standard user management, OAuth and 2FA (auth teammate).
- HTTPS proxy, compose single-command, ELK, Prometheus/Grafana, WAF/Vault (devops, likely).
- Games, tournaments, game customization, spectator mode (game owner).
- Privacy Policy and Terms: one team page. Offer a paragraph about chat data.

**Do not claim**
- Notifications, file upload, search, public API, WCAG, i18n/RTL, additional browsers, PWA, design system, real-time collaboration, analytics, GDPR, AI modules. Each is large for the points and none is near.
- Advanced chat until the basic chat module is truly done and you have asked whether it can be claimed without a game. Treat it as a stretch.
- Organization system, unless time remains after P3. It is 2 points but the "guild = organization" argument is uncertain.

**Order of work against the subject**
1. P0 first: Dockerfiles in one compose, HTTPS via the team proxy, untrack `.env`/`node_modules`/`dist`, `.env.example`, real `.gitignore`. These are rejection-level.
2. P1: JWT from the auth teammate in REST and WebSocket. Drop client-supplied ids.
3. P2 then P3 for the real-time and interact modules. Test them with two real browsers before saying they are done.
4. P4 voice, only if P0–P3 are green.
5. P5: tests, README sections, Chrome console pass, rehearse the demo of each claimed module.

If the team is short of 14 points by the final week, drop voice before dropping any module that is already near done. A module that fails the demo is worth 0, so better to claim fewer modules that work than more that do not.
