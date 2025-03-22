/*
  Warnings:

  - You are about to drop the column `lastUpdated` on the `ProductProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductProvider" DROP COLUMN "lastUpdated",
ADD COLUMN     "lastProviderUpdate" TIMESTAMP(3);
