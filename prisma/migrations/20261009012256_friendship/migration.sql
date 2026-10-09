-- CreateTable
CREATE TABLE "friendship" (
    "user_id" BIGINT NOT NULL,
    "friend_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateIndex
CREATE INDEX "friendship_friend_id_idx" ON "friendship"("friend_id");

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
