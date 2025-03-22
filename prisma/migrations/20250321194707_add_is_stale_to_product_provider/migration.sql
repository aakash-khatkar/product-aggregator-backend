/*
  Warnings:

  - You are about to drop the column `isStale` on the `Provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductProvider" ADD COLUMN     "isStale" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "isStale";

-- CreateIndex
CREATE INDEX "ProductProvider_isStale_idx" ON "ProductProvider"("isStale");
