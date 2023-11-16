/*
  Warnings:

  - The primary key for the `Settlements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `fromAddress` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `gasFeePaid` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `toAddress` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `txnHash` on the `Settlements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[settlementTxnHash]` on the table `Settlements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commissionAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromWalletAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlementAddress` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlementAmount` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlementTxnHash` to the `Settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalGasFeePaid` to the `Settlements` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Settlements_txnHash_key";

-- AlterTable
ALTER TABLE "Settlements" DROP CONSTRAINT "Settlements_pkey",
DROP COLUMN "amount",
DROP COLUMN "fromAddress",
DROP COLUMN "gasFeePaid",
DROP COLUMN "toAddress",
DROP COLUMN "txnHash",
ADD COLUMN     "commissionAddress" TEXT NOT NULL,
ADD COLUMN     "fromWalletAddress" TEXT NOT NULL,
ADD COLUMN     "settlementAddress" TEXT NOT NULL,
ADD COLUMN     "settlementAmount" TEXT NOT NULL,
ADD COLUMN     "settlementTxnHash" TEXT NOT NULL,
ADD COLUMN     "totalGasFeePaid" TEXT NOT NULL,
ADD CONSTRAINT "Settlements_pkey" PRIMARY KEY ("settlementTxnHash");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_settlementTxnHash_key" ON "Settlements"("settlementTxnHash");

-- AddForeignKey
ALTER TABLE "Settlements" ADD CONSTRAINT "Settlements_fromWalletAddress_fkey" FOREIGN KEY ("fromWalletAddress") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
