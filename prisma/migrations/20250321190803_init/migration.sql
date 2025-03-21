-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "staleAfterMs" INTEGER NOT NULL,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductProvider" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "availability" BOOLEAN NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductHistory" (
    "id" TEXT NOT NULL,
    "productProviderId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE INDEX "Provider_isActive_idx" ON "Provider"("isActive");

-- CreateIndex
CREATE INDEX "ProductProvider_productId_idx" ON "ProductProvider"("productId");

-- CreateIndex
CREATE INDEX "ProductProvider_providerId_idx" ON "ProductProvider"("providerId");

-- CreateIndex
CREATE INDEX "ProductProvider_availability_idx" ON "ProductProvider"("availability");

-- CreateIndex
CREATE INDEX "ProductProvider_isActive_idx" ON "ProductProvider"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductProvider_providerId_externalId_key" ON "ProductProvider"("providerId", "externalId");

-- CreateIndex
CREATE INDEX "ProductHistory_productProviderId_changedAt_idx" ON "ProductHistory"("productProviderId", "changedAt");

-- CreateIndex
CREATE INDEX "ProductHistory_changedAt_idx" ON "ProductHistory"("changedAt");

-- AddForeignKey
ALTER TABLE "ProductProvider" ADD CONSTRAINT "ProductProvider_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductProvider" ADD CONSTRAINT "ProductProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_productProviderId_fkey" FOREIGN KEY ("productProviderId") REFERENCES "ProductProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
