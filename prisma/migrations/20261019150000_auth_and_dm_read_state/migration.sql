-- Add password authentication and durable DM read cursors.
ALTER TABLE "user" ADD COLUMN "password_hash" TEXT NOT NULL DEFAULT '$argon2id$v=19$m=65536,p=4,t=3$kBV7FjeMCkndYMuX1fTGyw$vbXvTg90IJzW2IineV81UyYrkgnPI5+HtiRDMak3nIo';
ALTER TABLE "direct_channel_member" ADD COLUMN "last_read_message_id" BIGINT;

-- message.channel_id is polymorphic; DM messages use dm_channel_id.
ALTER TABLE "message" DROP CONSTRAINT IF EXISTS "message_channel_id_fkey";
