import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductStaleMarkerService {
  private readonly logger = new Logger(ProductStaleMarkerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async markStaleProducts(): Promise<void> {
    const now = new Date();

    // Get all providers with staleAfterMs set
    const providers = await this.prisma.provider.findMany({
      where: {
        isActive: true,
        staleAfterMs: {
          gt: 0,
        },
      },
      select: {
        id: true,
        staleAfterMs: true,
      },
    });

    let totalMarked = 0;

    for (const provider of providers) {
      const thresholdTime = new Date(now.getTime() - provider.staleAfterMs);

      const result = await this.prisma.productProvider.updateMany({
        where: {
          providerId: provider.id,
          isStale: false,
          lastProviderUpdate: {
            lt: thresholdTime,
          },
        },
        data: {
          isStale: true,
        },
      });

      if (result.count > 0) {
        this.logger.log(
          `Marked ${result.count} product(s) as stale for provider: ${provider.id}`,
        );
      }

      totalMarked += result.count;
    }

    if (totalMarked === 0) {
      this.logger.log('No stale products to mark.');
    }
  }
}
