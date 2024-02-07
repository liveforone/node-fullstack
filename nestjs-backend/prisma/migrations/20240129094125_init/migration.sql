-- CreateEnum
CREATE TYPE "ReplyState" AS ENUM ('ORIGINAL', 'EDITED');

-- CreateTable
CREATE TABLE "Reply" (
    "id" BIGSERIAL NOT NULL,
    "writer_id" TEXT NOT NULL,
    "post_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "reply_state" "ReplyState" NOT NULL DEFAULT 'ORIGINAL',
    "created_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
