-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "fetchIntervalMs" DROP NOT NULL,
ALTER COLUMN "fetchIntervalMs" DROP DEFAULT;
