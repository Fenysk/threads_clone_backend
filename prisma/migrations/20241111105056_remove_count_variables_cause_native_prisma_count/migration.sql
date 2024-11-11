/*
  Warnings:

  - You are about to drop the column `likesCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `quotesCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `repliesCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `repostsCount` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likesCount",
DROP COLUMN "quotesCount",
DROP COLUMN "repliesCount",
DROP COLUMN "repostsCount";
