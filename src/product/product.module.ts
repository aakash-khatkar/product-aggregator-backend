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
import { ProductStaleMarkerService } from './stale/product-stale-marker.service';
import { ProductController } from './product.controller';
import { ProductQueryService } from './query/product-query.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductHistoryRepository } from './repositories/product-history.repository';
import { ProductStreamController } from './product-stream.controller';

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
    ProductSyncService,
    ProductStaleMarkerService,
    ProductQueryService,
    ProductRepository,
    ProductHistoryRepository,
  ],
  exports:[
    ProductService
  ],
  controllers: [ProductController , ProductStreamController]
})
export class ProductModule {}