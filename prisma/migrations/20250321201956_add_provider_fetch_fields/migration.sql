-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "fetchIntervalMs" INTEGER NOT NULL DEFAULT 10000,
ADD COLUMN     "lastFetchedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Provider_fetchIntervalMs_idx" ON "Provider"("fetchIntervalMs");

-- CreateIndex
CREATE INDEX "Provider_lastFetchedAt_idx" ON "Provider"("lastFetchedAt");
