import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';

import { NormalizerFactory } from './normalizers/normalizer.factory';
import { NormalizedProduct } from './interfaces/normalized-product.interface';
import { ProductService } from './product.service';

@Processor('product-raw')
@Injectable()
export class ProductConsumerService {
  private readonly logger = new Logger(ProductConsumerService.name);

  constructor(
    private readonly normalizerFactory: NormalizerFactory,
    private readonly productService: ProductService,
  ) {}

  @Process('process-raw-products')
  async handleRawProductData(job: Job<{ providerName: string; products: any[] }>) {
    const { providerName, products } = job.data;

    try {
      this.logger.log(`[${providerName}] Received ${products.length} product(s)`);

      // 1. Get correct normalizer for this provider
      const normalizer = this.normalizerFactory.getNormalizer(providerName);

      // 2. Normalize all products from this provider
      const normalizedProducts: NormalizedProduct[] = products.map((raw) =>
        normalizer.normalize(raw),
      );

      this.logger.log(`[${providerName}] Normalized - ${normalizedProducts.length} product(s)`);

      // 3. Delegate to product service for persistence & tracking
      await this.productService.syncNormalizedProducts(providerName, normalizedProducts);

      for (const p of normalizedProducts) {
        this.logger.debug(`[${providerName}] Normalized: ${JSON.stringify(p)}`);
      }
    } catch (error) {
      this.logger.error(
        `[${providerName}] Failed to process job: ${error.message}`,
        error.stack,
      );
      throw error; // Re-throw to let Bull mark it as failed (for retries / DLQ etc.)
    }
  }
}