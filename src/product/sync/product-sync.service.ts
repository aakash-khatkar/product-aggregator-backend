import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NormalizedProduct } from '../interfaces/normalized-product.interface';
import { ProductUpdateInput, ProductHistoryInput } from './sync.types';

@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sync(providerName: string, products: NormalizedProduct[]): Promise<void> {
    const provider = await this.prisma.provider.findUnique({
      where: { name: providerName },
    });

    if (!provider) {
      throw new Error(`Provider "${providerName}" not found`);
    }

    const existingMap = await this.getExistingProductProviderMap(provider.id, products);

    const { updates, historyRecords } = this.buildUpdateAndHistoryPayloads(
      products,
      existingMap,
      provider.id,
    );

    await this.bulkInsertHistory(historyRecords);
    await this.bulkUpdateProducts(updates);
  }

  private async getExistingProductProviderMap(
    providerId: string,
    products: NormalizedProduct[],
  ): Promise<
    Map<
      string,
      {
        id: string;
        productId: string;
        price: number;
        availability: boolean;
      }
    >
  > {
    const externalIds = products.map((p) => p.externalId);

    const existing = await this.prisma.productProvider.findMany({
      where: {
        providerId,
        externalId: { in: externalIds },
      },
      select: {
        id: true,
        productId: true,
        externalId: true,
        price: true,
        availability: true,
      },
    });

    return new Map(existing.map((e) => [e.externalId, e]));
  }

  private buildUpdateAndHistoryPayloads(
    products: NormalizedProduct[],
    existingMap: Map<string, { id: string; productId: string; price: number; availability: boolean }>,
    providerId: string,
  ): {
    updates: ProductUpdateInput[];
    historyRecords: ProductHistoryInput[];
  } {
    const updates: ProductUpdateInput[] = [];
    const historyRecords: ProductHistoryInput[] = [];

    for (const product of products) {
      const existing = existingMap.get(product.externalId);
      if (!existing) {
        this.logger.warn(`Skipping unknown product (externalId: ${product.externalId})`);
        continue;
      }

      const isChanged =
        existing.price !== product.price ||
        existing.availability !== product.availability;

      if (isChanged) {
        historyRecords.push({
          productProviderId: existing.id,
          price: product.price,
          availability: product.availability,
          changedAt: product.lastProviderUpdate,
        });
      }

      updates.push({
        where: {
          providerId_externalId: {
            providerId,
            externalId: product.externalId,
          },
        },
        data: {
          price: product.price,
          availability: product.availability,
          currency: product.currency,
          lastProviderUpdate: product.lastProviderUpdate,
          isStale: false,
        },
      });
    }

    return { updates, historyRecords };
  }

  private async bulkInsertHistory(historyRecords: ProductHistoryInput[]): Promise<void> {
    if (historyRecords.length === 0) return;

    await this.prisma.productHistory.createMany({
      data: historyRecords,
      skipDuplicates: true,
    });

    this.logger.log(`Inserted ${historyRecords.length} history records.`);
  }

  private async bulkUpdateProducts(updates: ProductUpdateInput[]): Promise<void> {
    if (updates.length === 0) return;

    await Promise.all(
      updates.map((update) =>
        this.prisma.productProvider.update(update),
      ),
    );

    this.logger.log(`Updated ${updates.length} product-provider records.`);
  }
}