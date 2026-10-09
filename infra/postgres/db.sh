#!/usr/bin/env bash
# Usage: infra/postgres/db.sh <up|down|reset|logs|psql|migrate|status>
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
ENV_FILE="$ROOT/.env"

[ -f "$ENV_FILE" ] || { echo "missing $ENV_FILE (copy infra/postgres/.env.example)"; exit 1; }
set -a; . "$ENV_FILE"; set +a

dc() { docker compose -f "$DIR/docker-compose.yml" --env-file "$ENV_FILE" "$@"; }

case "${1:-}" in
  up)      dc up -d --wait ;;
  down)    dc down ;;
  reset)   dc down -v && dc up -d --wait && (cd "$ROOT" && npx prisma migrate deploy) ;;
  logs)    dc logs -f postgres ;;
  psql)    dc exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" ;;
  migrate) (cd "$ROOT" && npx prisma migrate dev "${@:2}") ;;
  status)  dc ps ;;
  *) echo "usage: $0 <up|down|reset|logs|psql|migrate|status>"; exit 1 ;;
esac
