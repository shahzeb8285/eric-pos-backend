/*
  Warnings:

  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_walletId_fkey";

-- DropTable
DROP TABLE "Transactions";

-- CreateTable
CREATE TABLE "OutgoingTransactions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txnHash" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "userId" TEXT,
    "amount" TEXT NOT NULL,
    "gasFee" TEXT,
    "currencySymbol" TEXT NOT NULL,
    "walletId" TEXT,

    CONSTRAINT "OutgoingTransactions_pkey" PRIMARY KEY ("txnHash")
);

-- CreateTable
CREATE TABLE "IncomingTransactions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txnHash" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "userId" TEXT,
    "amount" TEXT NOT NULL,
    "gasFee" TEXT,
    "currencySymbol" TEXT NOT NULL,
    "walletId" TEXT,

    CONSTRAINT "IncomingTransactions_pkey" PRIMARY KEY ("txnHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutgoingTransactions_txnHash_key" ON "OutgoingTransactions"("txnHash");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingTransactions_txnHash_key" ON "IncomingTransactions"("txnHash");

-- AddForeignKey
ALTER TABLE "OutgoingTransactions" ADD CONSTRAINT "OutgoingTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutgoingTransactions" ADD CONSTRAINT "OutgoingTransactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingTransactions" ADD CONSTRAINT "IncomingTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingTransactions" ADD CONSTRAINT "IncomingTransactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;
