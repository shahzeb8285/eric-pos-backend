-- CreateEnum
CREATE TYPE "TransactionCallBackStatus" AS ENUM ('ACK', 'UNACK');

-- AlterTable
ALTER TABLE "IncomingTransactions" ADD COLUMN     "callbackStatus" "TransactionCallBackStatus" NOT NULL DEFAULT 'UNACK';
