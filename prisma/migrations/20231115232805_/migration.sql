/*
  Warnings:

  - Added the required column `commissionAmount` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commissionTxnHash` to the `Settlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settlements" ADD COLUMN     "commissionAmount" TEXT NOT NULL,
ADD COLUMN     "commissionTxnHash" TEXT NOT NULL;
