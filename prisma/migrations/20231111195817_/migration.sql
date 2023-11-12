/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Merchant_name_key" ON "Merchant"("name");
