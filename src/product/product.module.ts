import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from 'src/database/prisma.module';
import { ProductConsumerService } from './product-consumer.service';

import { NoonNormalizer } from './normalizers/noon-normalizer.service';
import { AmazonNormalizer } from './normalizers/amazon-normalizer.service';
import { CareemNormalizer } from './normalizers/careem-normalizer.service';
import { NormalizerFactory } from './normalizers/normalizer.factory';
import { ProductService } from './product.service';
import { ProductSyncService } from './sync/product-sync.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'product-raw',
    }),
  ],
  providers: [
    ProductConsumerService,
    NoonNormalizer,
    AmazonNormalizer,
    CareemNormalizer,
    NormalizerFactory,
    ProductService,
    ProductSyncService
  ],
})
export class ProductModule {}