/*
  Warnings:

  - You are about to drop the column `status` on the `Transactions` table. All the data in the column will be lost.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_walletId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_walletId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address");

-- DropEnum
DROP TYPE "TxnStatus";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;
