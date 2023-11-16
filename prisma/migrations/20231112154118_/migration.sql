-- CreateTable
CREATE TABLE "Balances" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "balance" TEXT NOT NULL,

    CONSTRAINT "Balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balances_walletAddress_key" ON "Balances"("walletAddress");

-- AddForeignKey
ALTER TABLE "Balances" ADD CONSTRAINT "Balances_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
