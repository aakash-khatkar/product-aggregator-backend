import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { FetcherModule } from 'src/fetcher/fetcher.module';
import { ProviderModule } from 'src/provider/provider.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProviderModule,
    FetcherModule,
    ProductModule
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}