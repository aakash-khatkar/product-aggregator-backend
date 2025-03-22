import { Injectable, Logger } from '@nestjs/common';
import { NormalizedProduct } from './interfaces/normalized-product.interface';
import { ProductSyncService } from './sync/product-sync.service';

@Injectable()
export class ProductService {
  constructor(private readonly productSyncService: ProductSyncService) {}

  async syncNormalizedProducts(
    providerName: string,
    products: NormalizedProduct[],
  ) {
    return await this.productSyncService.sync(providerName, products);
  }
}