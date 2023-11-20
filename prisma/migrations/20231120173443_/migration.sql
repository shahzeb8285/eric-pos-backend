/*
  Warnings:

  - You are about to drop the `Balances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Balances" DROP CONSTRAINT "Balances_walletAddress_fkey";

-- DropTable
DROP TABLE "Balances";
