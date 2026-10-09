-- Runs once, on first container start (empty volume only).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- future: message search
