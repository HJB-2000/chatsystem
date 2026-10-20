/*
  Warnings:

  - A unique constraint covering the columns `[user_tag_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_tag_id" TEXT;

-- CreateIndex
CREATE INDEX "direct_channel_member_channel_id_idx" ON "direct_channel_member"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_tag_id_key" ON "user"("user_tag_id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_dm_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "direct_channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;
