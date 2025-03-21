import { Module } from '@nestjs/common';
import { AmazonController } from './amazon.controller';
import { AmazonService } from './amazon.service';
import { AmazonProductStore } from './stores/amazon-product-store.service';
import { PriceUpdaterJob } from './jobs/price-updater.job';

@Module({
  controllers: [AmazonController],
  providers: [AmazonService, AmazonProductStore, PriceUpdaterJob],
  exports: [AmazonService, AmazonProductStore],
})
export class AmazonModule {}