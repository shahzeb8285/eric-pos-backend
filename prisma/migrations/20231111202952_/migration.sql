/*
  Warnings:

  - Added the required column `last_assigned_at` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "last_assigned_at" TIMESTAMP(3) NOT NULL;
