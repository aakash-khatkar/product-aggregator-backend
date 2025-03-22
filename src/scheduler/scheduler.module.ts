import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { FetcherModule } from 'src/fetcher/fetcher.module';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProviderModule,
    FetcherModule
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}