/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Mention` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hashtag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Mention" DROP COLUMN "createdAt";
