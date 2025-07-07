-- CreateEnum
CREATE TYPE "HuntStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "HuntMode" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ORGANIZER';

-- CreateTable
CREATE TABLE "TreasureHunt" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "mode" "HuntMode" NOT NULL DEFAULT 'PUBLIC',
    "fee" INTEGER,
    "mapStyle" TEXT,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "status" "HuntStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreasureHunt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TreasureHunt" ADD CONSTRAINT "TreasureHunt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
