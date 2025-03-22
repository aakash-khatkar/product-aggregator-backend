import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoonModule } from './external-providers/noon/noon.module';
import { NoonController } from './external-providers/noon/noon.controller';
import { NoonService } from './external-providers/noon/noon.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CareemModule } from './external-providers/careem/careem.module';
import { CareemController } from './external-providers/careem/careem.controller';
import { CareemService } from './external-providers/careem/careem.service';
import { AmazonModule } from './external-providers/amazon/amazon.module';
import { AmazonController } from './external-providers/amazon/amazon.controller';
import { AmazonService } from './external-providers/amazon/amazon.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { QueueModule } from './queue/queue.module';
import { BullModule } from '@nestjs/bull';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    ScheduleModule.forRoot(),
    NoonModule,
    CareemModule,
    AmazonModule,
    ProviderModule,
    SchedulerModule,
    FetcherModule,
    QueueModule,
    ProductModule,
  ],
  controllers: [AppController, NoonController, CareemController, AmazonController],
  providers: [AppService, NoonService, CareemService, AmazonService],
})
export class AppModule {}
