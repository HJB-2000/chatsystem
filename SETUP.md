# ChatSystem Setup Guide

This guide explains how to run ChatSystem on a new machine after cloning the repository.

## 1. Install Prerequisites

Install the following software:

- Git
- Node.js 20 or newer
- npm
- Docker
- Docker Compose

Verify the installations:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
```

## 2. Clone the Repository

```bash
git clone <repository-url>
cd ChatSystem/old-version
```

Replace `<repository-url>` with the repository's Git URL.

## 3. Install Backend Dependencies

From the repository root:

```bash
npm install
```

## 4. Install Frontend Dependencies

The React frontend is in a directory whose name contains a space:

```bash
cd "front-end/react replacement"
npm install
cd ../..
```

## 5. Create the Environment File

From the repository root:

```bash
cp infra/postgres/env.example .env
```

The default local services use these ports:

```text
PostgreSQL:  localhost:5432
Redis:       localhost:6380
Kafka:       localhost:9092
REST API:    localhost:3000
Gateway:     localhost:3001
```

Keep the database settings in `.env` consistent with `DATABASE_URL`.

## 6. Start Database Infrastructure

Start PostgreSQL, Redis, and Kafka:

```bash
infra/postgres/db.sh up
```

Check the containers:

```bash
infra/postgres/db.sh status
```

All three containers should be running and healthy.

## 7. Apply Prisma Migrations

From the repository root:

```bash
npx prisma generate
npx prisma migrate deploy
```

This creates the database tables and applies all migrations committed to the repository.

## 8. Create Demo Data

Run the idempotent seed:

```bash
npm run db:seed
```

The seed creates demo users, servers, rooms, memberships, friendships, avatars, presence, and sample messages.

The command prints the user ID to use. The main demo user is usually:

```text
Username: demo_user
User ID: 2
```

Always use the ID printed by the seed command if it differs.

## 9. Start the Backend

From the repository root:

```bash
npm run start:dev
```

This starts both backend services:

```text
ChatSystem REST API: http://localhost:3000
Realtime Gateway:    ws://localhost:3001/gateway
```

The command explicitly assigns separate ports to the ChatSystem and Gateway.

## 10. Start the React Frontend

Open a second terminal:

```bash
cd ChatSystem/old-version/front-end/react\ replacement
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173/?userId=2
```

Replace `2` with the demo user ID printed by `npm run db:seed`.

## 11. Verify the API

With the backend running, test the demo user:

```bash
curl http://localhost:3000/api/users/2
curl "http://localhost:3000/api/collectives?userId=2"
curl "http://localhost:3000/api/collectives/1/rooms?userId=2"
```

Replace `2` when your seed generated a different user ID.

## 12. Run the Integration Stress Test

The stress test checks REST, PostgreSQL persistence, Kafka, Gateway fan-out, heartbeat, presence, typing, and concurrent message writes.

From the repository root:

```bash
TEST_USER_ID=2 npm run test:stress
```

Use the actual seeded user ID if it is not `2`.

A successful test ends with a message similar to:

```text
PASS: REST, PostgreSQL persistence, Kafka/Gateway fan-out, heartbeat, presence, typing
```

## 13. Build Checks

Backend build:

```bash
npm run build
```

Frontend build:

```bash
cd "front-end/react replacement"
npm run build
```

## Reset the Local Database

To delete the local PostgreSQL volume, recreate the schema, and seed fresh demo data:

```bash
infra/postgres/db.sh reset
npm run db:seed
```

This deletes all local database data. Do not use it if you need to preserve existing data.

## Stop Services

Stop the application terminals with `Ctrl+C`.

Stop Docker infrastructure:

```bash
infra/postgres/db.sh down
```

## Common Problems

### Port 3000 or 3001 is already in use

Stop the existing backend process, then start the services with:

```bash
CHAT_PORT=3000 GATEWAY_PORT=3001 npm run start:dev
```

### The frontend says the user cannot be loaded

Make sure the backend is running and that the URL contains a valid seeded user ID:

```text
http://localhost:5173/?userId=2
```

### Prisma cannot reach PostgreSQL

Check the containers:

```bash
infra/postgres/db.sh status
```

Then start them if necessary:

```bash
infra/postgres/db.sh up
```

### Kafka or Redis is unavailable

Restart the infrastructure:

```bash
infra/postgres/db.sh down
infra/postgres/db.sh up
```

Then restart the backend with:

```bash
npm run start:dev
```
