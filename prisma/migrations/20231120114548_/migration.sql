/*
  Warnings:

  - You are about to drop the column `detachedAt` on the `OrphanHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrphanHistory" DROP COLUMN "detachedAt";

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settings" TEXT NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);
