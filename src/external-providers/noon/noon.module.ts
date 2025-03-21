import { Module } from '@nestjs/common';
import { NoonController } from './noon.controller';
import { NoonService } from './noon.service';
import { PriceUpdaterJob } from './jobs/price-updater.job';
import { NoonProductStore } from './stores/noon-product-store.service';

@Module({
  controllers: [NoonController],
  providers: [NoonService, PriceUpdaterJob, NoonProductStore],
  exports: [NoonService, NoonProductStore],
})
export class NoonModule {}