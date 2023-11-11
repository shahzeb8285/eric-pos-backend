/*
  Warnings:

  - Added the required column `from_address` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_address` to the `Settlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settlements" ADD COLUMN     "from_address" TEXT NOT NULL,
ADD COLUMN     "to_address" TEXT NOT NULL;
