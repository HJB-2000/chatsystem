-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_dm_channel_id_fkey";

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "dm_channel_id" BIGINT,
ALTER COLUMN "channel_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "message_dm_channel_id_message_id_idx" ON "message"("dm_channel_id", "message_id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_dm_channel_id_fkey" FOREIGN KEY ("dm_channel_id") REFERENCES "direct_channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;
