# infra/postgres

Layout:
- docker-compose.yml : postgres:16 + volume + healthcheck
- init/*.sql         : run once on empty volume
- db.sh              : up | down | reset | logs | psql | migrate | status
- .env.example       : copy to repo root as .env

Flow:
  cp infra/postgres/.env.example .env
  infra/postgres/db.sh up
  infra/postgres/db.sh migrate --name init

Wipe data:  infra/postgres/db.sh reset
