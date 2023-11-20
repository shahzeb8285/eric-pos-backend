-- CreateTable
CREATE TABLE "OrphanHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detachedAt" TIMESTAMP(3),
    "txnHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrphanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrphanHistory_txnHash_key" ON "OrphanHistory"("txnHash");
