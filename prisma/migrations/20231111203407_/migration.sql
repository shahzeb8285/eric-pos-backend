/*
  Warnings:

  - You are about to drop the column `from_address` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `to_address` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `token_address` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `txn_hash` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `currency_symbol` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `from_address` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `gas_fee` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `txn_direction` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `txn_hash` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `last_assigned_at` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[txnHash]` on the table `Settlements` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[txnHash]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnHash` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencySymbol` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromAddress` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnDirection` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnHash` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastAssignedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pathId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Settlements_txn_hash_key";

-- DropIndex
DROP INDEX "Transactions_txn_hash_key";

-- AlterTable
ALTER TABLE "Settlements" DROP COLUMN "from_address",
DROP COLUMN "to_address",
DROP COLUMN "token_address",
DROP COLUMN "txn_hash",
ADD COLUMN     "fromAddress" TEXT NOT NULL,
ADD COLUMN     "toAddress" TEXT NOT NULL,
ADD COLUMN     "tokenAddress" TEXT NOT NULL,
ADD COLUMN     "txnHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "currency_symbol",
DROP COLUMN "from_address",
DROP COLUMN "gas_fee",
DROP COLUMN "txn_direction",
DROP COLUMN "txn_hash",
ADD COLUMN     "currencySymbol" TEXT NOT NULL,
ADD COLUMN     "fromAddress" TEXT NOT NULL,
ADD COLUMN     "gasFee" TEXT,
ADD COLUMN     "txnDirection" "TxnDirection" NOT NULL,
ADD COLUMN     "txnHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "last_assigned_at",
ADD COLUMN     "lastAssignedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pathId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_txnHash_key" ON "Settlements"("txnHash");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_txnHash_key" ON "Transactions"("txnHash");
