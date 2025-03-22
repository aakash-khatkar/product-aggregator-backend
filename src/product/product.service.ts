import { Injectable, Logger } from '@nestjs/common';
import { NormalizedProduct } from './interfaces/normalized-product.interface';
import { ProductSyncService } from './sync/product-sync.service';
import { ProductStaleMarkerService } from './stale/product-stale-marker.service';

@Injectable()
export class ProductService {
  constructor(private readonly productSyncService: ProductSyncService, private readonly staleMarker: ProductStaleMarkerService) { }

  async syncNormalizedProducts(
    providerName: string,
    products: NormalizedProduct[],
  ) {
    return await this.productSyncService.sync(providerName, products);
  }
  async markStaleProducts() {
    return await this.staleMarker.markStaleProducts();
  }
}