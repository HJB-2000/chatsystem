-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('TEXT', 'VOICE', 'CATEGORY');

-- CreateTable
CREATE TABLE "user" (
    "user_id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "guild" (
    "guild_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "owner_id" BIGINT NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "channel" (
    "channel_id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'TEXT',
    "category_id" BIGINT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "member" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "nickname" TEXT,
    "role_ids" JSONB NOT NULL DEFAULT '[]',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "role" (
    "role_id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" BIGINT NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "message" (
    "message_id" BIGSERIAL NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "author_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "embeds" JSONB,
    "attachments" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3),

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "guild_owner_id_idx" ON "guild"("owner_id");

-- CreateIndex
CREATE INDEX "channel_guild_id_position_idx" ON "channel"("guild_id", "position");

-- CreateIndex
CREATE INDEX "member_user_id_idx" ON "member"("user_id");

-- CreateIndex
CREATE INDEX "role_guild_id_idx" ON "role"("guild_id");

-- CreateIndex
CREATE INDEX "message_channel_id_message_id_idx" ON "message"("channel_id", "message_id");

-- AddForeignKey
ALTER TABLE "guild" ADD CONSTRAINT "guild_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "channel"("channel_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
