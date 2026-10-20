# chatsystem runtime audit (17/10/2026)

Env: node v24.21.0, nest CLI 12.0.8. Infra ran as compose project `chataudit` on overridden ports (pg 15432, redis 16379, kafka 19092); apps on 13000/13001/13002. Scylla not started (no app imports `libs/scylla`; only the lib + its spec reference it).

| # | Step | Command | Result | Key line |
|---|---|---|---|---|
| 1 | Toolchain usable | `node_modules/.bin/nest --version` | PASS | `12.0.8` (committed node_modules works as-is; 34,566 files tracked) |
| 2a | Build chatsystem | `npx nest build chatsystem` | PASS | `Rspack 2.2.8 compiled successfully in 23 ms` |
| 2b | Build gateway | `npx nest build gateway` | PASS | `compiled successfully in 20 ms` |
| 2c | Build voice-signaling | `npx nest build voice-signaling` | PASS | `compiled successfully in 16 ms` |
| 2d | Real typecheck | `npx tsc --noEmit -p tsconfig.json` | PASS | rc=0 (rspack build does not type-check; tsc does, and is clean) |
| 3 | Unit tests | `npm test` | PASS | `Test Suites: 9 passed, Tests: 9 passed` |
| 4 | Lint | `npm run lint` | FAIL | `oxlint --type-aware src/ test/` -> `No files found to lint` (rc=1) |
| 5 | Infra | `docker compose -p chataudit up -d` | PASS | postgres, redis, kafka all `healthy` |
| 6a | Migrations | `prisma migrate deploy` | PASS | 3 migrations applied, `migrate status`: up to date |
| 6b | Schema drift | `prisma migrate diff --exit-code` | FAIL (minor) | rc=2: missing index `direct_channel_member(channel_id)` + 2 FKs on `message.channel_id` |
| 6c | Seed | `npm run db:seed` | PASS | 3 users, guilds/rooms/messages created |
| 7a | Boot chatsystem | `node dist/apps/chatsystem/main.js` | PASS | `Nest application successfully started`, all routes mapped, kafka producer connected |
| 7b | Boot gateway | `node dist/apps/gateway/main.js` | PASS | `Gateway ready on /gateway`; one transient kafka `group coordinator is not available` at startup, then consuming |
| 7c | Boot voice-signaling | `node dist/apps/voice-signaling/main.js` | PASS (but stub) | only `GET /` -> `Hello World!` |
| 7d | REST smoke | curl `/api/users`, `/collectives`, `/rooms/:id/messages` (GET/POST) | PASS | 200/201, data from seed |
| 7e | WS smoke | ws client, op 2 IDENTIFY token `2`; REST post as user 1 | PASS | received `READY` then `MESSAGE_CREATE` (kafka -> gateway -> ws works end to end) |
| 8 | React build | `npx vite build` (front-end/react replacement) | PASS | `built in 110ms`, 19 modules, JS 163 kB |
| 9 | Teardown | kill node, `down -v` | PASS | no chataudit containers/volumes/ports left; nabta containers untouched |

## Findings

**R-01 CRIT: no authentication anywhere; identity is a client-supplied string.**
REST: `userId`/`senderId` are plain body/query params. Evidence: `POST /api/rooms/1/messages {"senderId":"3","message":"spoof as 3"}` -> `201`, stored as `demo_moderator`. `PATCH /api/users/1 {"username":"pwned"}` with no credential -> `200`.
WS: `apps/gateway/src/app/session-loader.service.ts` documents "token == user id"; IDENTIFY with token `2` yields a full READY for `demo_friend` (guilds 1-3, all channels). Anyone can be anyone by counting integers.
Fix: real login (argon2 is already a dependency; `@nestjs/jwt` and passport are installed but unused), derive the user from the verified token in a guard, drop userId from bodies/queries; gateway IDENTIFY validates the JWT.

**R-02 HIGH: authorization only partially enforced, and is moot given R-01.**
Membership is checked (user 999 -> `403 Not a member of this collective`; editing/deleting another user's message -> `403`), so the checks are real, but they key on the spoofable id. `PATCH /api/users/:id` has no ownership check at all (R-01 evidence).
Fix: after R-01, take `req.user.id` and compare against `:id` for user updates.

**R-03 MED: invalid/missing input returns 500, not 400.**
`GET /api/rooms/1/messages` (no userId) -> `500`, log `TypeError: Cannot convert undefined to a BigInt`; `GET /api/users/abc` -> `500`, `SyntaxError: Cannot convert abc to a BigInt`; `POST /api/rooms/1/messages {}` -> `500`. No DTO validation: controller bodies are typed `any`/inline types; `class-validator` is installed but no `ValidationPipe` is registered in `main.ts`.
Fix: `app.useGlobalPipes(new ValidationPipe({whitelist:true, transform:true}))` + DTO classes; parse ids with a pipe that returns 400.

**R-04 MED: lint is a no-op, tests are boilerplate.**
`npm run lint` -> `No files found to lint. Please check your paths and ignore patterns.` (script points to `src/ test/`, which do not exist; code is under `apps/` and `libs/`). 9 spec files, 9 tests, all of the form `it('should be defined')`; none of ChatService (547 lines), the controller, the gateway or its protocol is tested. The 3 `apps/*/test/app.e2e-spec.ts` files exist but were not part of `npm test`; the e2e script needs `jest-e2e.json` projects and was not run.
Fix: `oxlint apps libs`; add tests for ChatService membership/edit/delete rules and gateway identify/heartbeat.

**R-05 MED: committed artefacts and secrets-adjacent files.**
`git ls-files` shows 34,566 files under `node_modules/`, plus tracked `.env` (contains a DB user and a password) and tracked `dist/` (5 files), while `.gitignore` is empty. A build rewrites tracked `dist/` files (`git status` showed `M dist/apps/gateway/main.js`, `M dist/tsconfig.tsbuildinfo`; I restored them). The generated Prisma client (`generated/`) is also committed.
Fix: add `.gitignore` (`node_modules`, `dist`, `.env`, `generated`, `coverage`), `git rm -r --cached`, rotate the committed password, keep `.env.example`.

**R-06 MED: `.env` is internally inconsistent.**
`REDIS_PORT`, `REDIS_URL`, `KAFKA_PORT`, `KAFKA_BROKERS`, `PORT`, `GATEWAY_PUBLIC_URL` appear twice; the second block sets `REDIS_URL=redis://localhost:6380` while compose publishes redis on `REDIS_PORT` (6379 in the first block, 6380 in the second). The file header is `# Copy to <repo-root>/.env` (it is a template pasted into the real file). With dotenv, the first value wins, so which port is actually used depends on load order. Also `PORT=3001` is shared by chatsystem and gateway if neither `CHAT_PORT` nor `GATEWAY_PORT` is set (chatsystem `process.env.CHAT_PORT ?? PORT ?? 3000`), so two apps started from this `.env` collide on 3001.
Fix: one block, distinct `CHAT_PORT`/`GATEWAY_PORT`/`VOICE_PORT`.

**R-07 LOW: voice-signaling is a scaffold.** Controller returns `Hello World!`; no signaling. Reads lowercase `process.env.port` (default 3000, which collides with the chatsystem default); `gateway.service.ts` is also `getHello()` stub. Voice join/leave in chatsystem is a DB flag only.

**R-08 LOW: schema/migration drift and duplicated init names.**
Three migrations, two named `_init` (`20261009002440_init`, `20261009053621_init`; the second is really an alter/add-invite migration). They apply cleanly on an empty DB, but `migrate diff` against `schema.prisma` reports a missing index on `direct_channel_member(channel_id)` and 2 foreign keys on `message.channel_id` (the first migration comments say they were deliberately omitted for partitioned tables). Fix: rename the second migration or squash, and add the missing objects or mark the schema accordingly.

**R-09 LOW: `main.ts` serves a `client/` static dir that does not exist** (`app.useStaticAssets(join(process.cwd(),'client'))`); harmless at runtime, dead code. Front-end default API URL is `http://localhost:3000` while the repo's `.env` uses 3001 for the gateway and the dev script uses 3000 for chat, so it works only with the `start:dev` script; override via `VITE_API_URL`/`VITE_GATEWAY_URL`.

**R-10 LOW: `TimeoutNegativeWarning: -1792257788372 is a negative number` at startup of chatsystem and gateway.** The magnitude equals the current epoch in ms, so some timer is computed as `0 - Date.now()` (suspected kafkajs config or an in-code expression; not traced). Non-fatal.

**R-11 INFO: Scylla/Cassandra:** `libs/scylla` and `cassandra-driver` are a dependency but nothing in apps uses them; compose does not provide Scylla. Messages live in Postgres, so the architecture docs (Scylla, snowflake ids) do not match the code (`libs/snowflake` is an empty `@Injectable()`).

**R-12 INFO: front-end** builds (vite 8, React `latest`) but deps are `"latest"` unpinned and there is no TypeScript/tsc in its package, so the `.ts/.tsx` sources are not type-checked by its build. Not browser-tested.

Teardown: all processes started were killed (pgrep clean), `docker compose -p chataudit down -v` removed the containers, volume and network, test ports are free; Nabta containers untouched. Tracked build output the audit modified in `chatsystem/dist` was restored with `git checkout`; his working tree is clean again. Scratch (logs, copied compose, ws script, fe-dist) is in `/home/mushigarou/AI_Lab/chatsystem-audit/run/`.
