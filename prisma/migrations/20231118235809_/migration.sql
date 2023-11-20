-- CreateTable
CREATE TABLE "WalletAssignment" (
    "id" TEXT NOT NULL,
    "attachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detachedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,

    CONSTRAINT "WalletAssignment_pkey" PRIMARY KEY ("id")
);
