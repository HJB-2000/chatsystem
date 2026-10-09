-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "voice_channel_id" BIGINT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "current_activity" TEXT,
ADD COLUMN     "last_presence" TEXT,
ADD COLUMN     "role_title" TEXT;

-- CreateTable
CREATE TABLE "invite" (
    "invite_id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "code" TEXT NOT NULL,
    "created_by_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "invite_pkey" PRIMARY KEY ("invite_id")
);

-- CreateTable
CREATE TABLE "direct_channel" (
    "channel_id" BIGSERIAL NOT NULL,
    "user_a" BIGINT NOT NULL,
    "user_b" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direct_channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "direct_channel_member" (
    "channel_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "direct_channel_member_pkey" PRIMARY KEY ("channel_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_code_key" ON "invite"("code");

-- CreateIndex
CREATE INDEX "invite_guild_id_idx" ON "invite"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "direct_channel_user_a_user_b_key" ON "direct_channel"("user_a", "user_b");

-- CreateIndex
CREATE INDEX "direct_channel_member_user_id_idx" ON "direct_channel_member"("user_id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_dm_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "direct_channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_channel_member" ADD CONSTRAINT "direct_channel_member_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "direct_channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_channel_member" ADD CONSTRAINT "direct_channel_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
