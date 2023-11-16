-- AlterTable
ALTER TABLE "IncomingTransactions" ADD COLUMN     "isOrphanTxn" BOOLEAN NOT NULL DEFAULT false;
