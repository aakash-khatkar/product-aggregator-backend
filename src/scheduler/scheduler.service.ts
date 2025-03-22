import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProviderService } from 'src/provider/provider.service';
import { FetcherService } from 'src/fetcher/fetcher.service';
import { ProductService } from 'src/product/product.service';
@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly providerService: ProviderService,
    private readonly fetcherService: FetcherService,
    private readonly productService: ProductService,
  ) {}

  onModuleInit() {
    this.logger.log('SchedulerService initialized.');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkAndTriggerFetch() {
    this.logger.log('Checking for providers due for fetch...');

    try {
      const providers = await this.providerService.getProvidersDueForFetch();

      if (!providers.length) {
        this.logger.log('No eligible providers at this time.');
        return;
      }

      this.logger.log(`Found ${providers.length} provider(s) to fetch.`);

      await Promise.allSettled(
        providers.map(async (provider) => {
          try {
            await this.fetcherService.fetchAndProcessProvider(provider);

            // Update lastFetchedAt only after successful fetch
            await this.providerService.updateLastFetchedAt(provider.id);
          } catch (error) {
            this.logger.error(`Failed to fetch ${provider.name}: ${error.message}`);
          }
        })
      );
    } catch (err) {
      this.logger.error('Scheduler failed:', err);
    }
  }

  @Cron('*/15 * * * * *')
  async checkAndMarkStaleProducts() {
    this.logger.log('Checking for stale products...');
    try {
      await this.productService.markStaleProducts();
    } catch (error) {
      this.logger.error('Failed to mark stale products', error.stack);
    }
  }
}