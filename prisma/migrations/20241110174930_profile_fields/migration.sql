-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
