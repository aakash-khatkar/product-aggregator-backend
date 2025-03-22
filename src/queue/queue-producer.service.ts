import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(@InjectQueue('product-raw') private readonly productQueue: Queue) {}

  async publishRawProductData(providerName: string, products: any[]): Promise<void> {
    if (!products || products.length === 0) {
      this.logger.warn(`[${providerName}] No products to publish.`);
      return;
    }

    await this.productQueue.add('process-raw-products', {
      providerName,
      products,
    });

    this.logger.log(`[${providerName}] Published ${products.length} product(s) to product-raw queue`);
  }
}