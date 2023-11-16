/*
  Warnings:

  - Added the required column `gasFeePaid` to the `Settlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settlements" ADD COLUMN     "gasFeePaid" TEXT NOT NULL;
