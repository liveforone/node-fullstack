/*
  Warnings:

  - You are about to drop the column `createdDate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdDate",
ADD COLUMN     "created_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "refreshToken",
ADD COLUMN     "refresh_token" TEXT;
