import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProductChangeFilterDto } from '../dto/product-changes.dto';

@Injectable()
export class ProductHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getChangedProducts(filter: ProductChangeFilterDto) {
    const since = new Date(filter.since);
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    // Get latest change per productProviderId since `since`
    const recentChangesRaw = await this.prisma.productHistory.findMany({
      where: { changedAt: { gte: since } },
      orderBy: [{ productProviderId: 'asc' }, { changedAt: 'desc' }],
      include: {
        productProvider: {
          include: {
            product: true,
            provider: true,
          },
        },
      },
    });

    // Use Map to retain only latest per productProviderId
    const latestMap = new Map<string, typeof recentChangesRaw[0]>();
    for (const change of recentChangesRaw) {
      if (!latestMap.has(change.productProviderId)) {
        latestMap.set(change.productProviderId, change);
      }
    }

    const latestChanges = Array.from(latestMap.values());

    // Prepare ids for fetching previous state
    const providerIds = latestChanges.map(c => c.productProviderId);

    const previousChanges = await this.prisma.productHistory.findMany({
      where: {
        productProviderId: { in: providerIds },
        changedAt: { lt: since },
      },
      orderBy: [{ productProviderId: 'asc' }, { changedAt: 'desc' }],
    });

    // Build map for previous changes
    const prevMap = new Map<string, { price: number, availability: boolean }>();
    for (const prev of previousChanges) {
      if (!prevMap.has(prev.productProviderId)) {
        prevMap.set(prev.productProviderId, {
          price: prev.price,
          availability: prev.availability,
        });
      }
    }

    // Group by product
    const groupedMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        changes: {
          providerId: string;
          providerName: string;
          oldPrice: number;
          newPrice: number;
          oldAvailability: boolean;
          newAvailability: boolean;
          changedAt: Date;
        }[];
      }
    >();

    for (const change of latestChanges) {
      const { id: productId, name: productName } = change.productProvider.product;
      const { id: providerId, name: providerName } = change.productProvider.provider;

      const prev = prevMap.get(change.productProviderId);
      const oldPrice = prev?.price ?? change.price;
      const oldAvailability = prev?.availability ?? change.availability;

      if (oldPrice === change.price && oldAvailability === change.availability) continue;

      if (!groupedMap.has(productId)) {
        groupedMap.set(productId, {
          productId,
          productName,
          changes: [],
        });
      }

      groupedMap.get(productId)!.changes.push({
        providerId,
        providerName,
        oldPrice,
        newPrice: change.price,
        oldAvailability,
        newAvailability: change.availability,
        changedAt: change.changedAt,
      });
    }

    const allGrouped = Array.from(groupedMap.values());
    const paginated = allGrouped.slice(skip, skip + limit);

    return {
      data: paginated,
      total: allGrouped.length,
      page,
      limit,
      totalPages: Math.ceil(allGrouped.length / limit),
    };
  }
}