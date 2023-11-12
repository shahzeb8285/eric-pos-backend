/*
  Warnings:

  - The primary key for the `Settlements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Settlements` table. All the data in the column will be lost.
  - You are about to drop the column `tokenAddress` on the `Settlements` table. All the data in the column will be lost.
  - Added the required column `currencySymbol` to the `Settlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settlements" DROP CONSTRAINT "Settlements_pkey",
DROP COLUMN "id",
DROP COLUMN "tokenAddress",
ADD COLUMN     "currencySymbol" TEXT NOT NULL,
ADD CONSTRAINT "Settlements_pkey" PRIMARY KEY ("txnHash");
