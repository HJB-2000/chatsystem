# ChatSystem Stress Tests

This directory contains a TypeScript end-to-end smoke/stress test for the core Discord-like path:

```text
React-compatible REST calls -> ChatSystem -> PostgreSQL/Kafka -> Gateway WebSocket clients
```

The test validates:

- ChatSystem health and user lookup
- Collective and room discovery
- Room membership, member roster, and message history
- Message persistence through REST
- Two authenticated Gateway clients
- Gateway `HELLO`, `READY`, heartbeat, and acknowledgements
- Realtime `MESSAGE_CREATE` fan-out
- Presence and typing frames
- Frontend production build

## Requirements

Start PostgreSQL, Kafka, Redis, ChatSystem, and Gateway first. The database must contain at least one user who belongs to a collective with a text room.

```bash
cd ~/ChatSystem/old-version
infra/postgres/db.sh up
npm run start:dev
```

Run the service stress test:

```bash
TEST_USER_ID=1 npm run test:stress
```

Optional variables:

```text
CHAT_API_URL=http://localhost:3000
GATEWAY_URL=ws://localhost:3001/gateway
TEST_ROOM_ID=123
STRESS_MESSAGE_COUNT=25
STRESS_TIMEOUT_MS=10000
```

The test intentionally fails with a clear message when the required infrastructure or seed data is unavailable. It does not silently fall back to mocks.
