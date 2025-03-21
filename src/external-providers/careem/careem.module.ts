import { Module } from '@nestjs/common';
import { CareemController } from './careem.controller';
import { CareemService } from './careem.service';
import { PriceUpdaterJob } from './jobs/price-updater.job';
import { CareemProductStore } from './stores/careem-product-store.service';

@Module({
  controllers: [CareemController],
  providers: [CareemService, PriceUpdaterJob, CareemProductStore],
  exports: [CareemService, CareemProductStore],
})
export class CareemModule {}