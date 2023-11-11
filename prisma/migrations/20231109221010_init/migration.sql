-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateEnum
CREATE TYPE "TxnDirection" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "max_usdt" TEXT NOT NULL,
    "min_usdt" TEXT NOT NULL,
    "min_bnb" TEXT NOT NULL,
    "max_bnb" TEXT NOT NULL,
    "merchant_call_back_url" TEXT NOT NULL,
    "bnb_wallet" TEXT NOT NULL,
    "commission_vault" TEXT NOT NULL,
    "merchant_wallet" TEXT NOT NULL,
    "min_commission" INTEGER NOT NULL,
    "comission_percentage" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlements" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" TEXT NOT NULL,
    "txn_hash" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,

    CONSTRAINT "Settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txn_hash" TEXT NOT NULL,
    "from_address" TEXT NOT NULL,
    "txn_direction" "TxnDirection" NOT NULL,
    "status" "TxnStatus" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_txn_hash_key" ON "Settlements"("txn_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_txn_hash_key" ON "Transactions"("txn_hash");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
