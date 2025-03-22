import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueProducerService } from './queue-producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'product-raw', // Queue name
    }),
  ],
  providers: [QueueProducerService],
  exports: [QueueProducerService], 
})
export class QueueModule {}