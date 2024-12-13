-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('everyone', 'followings', 'mentioned');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'everyone';
