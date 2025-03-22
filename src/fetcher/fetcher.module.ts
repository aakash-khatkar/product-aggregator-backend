import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FetcherService } from './fetcher.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [HttpModule, QueueModule],
  providers: [FetcherService],
  exports: [FetcherService], // So SchedulerModule or others can use it
})
export class FetcherModule {}