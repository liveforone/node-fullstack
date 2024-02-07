-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PostState" AS ENUM ('ORIGINAL', 'EDITED');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "refreshToken" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "post_state" "PostState" NOT NULL DEFAULT 'ORIGINAL',
    "writer_id" TEXT NOT NULL,
    "createdDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
