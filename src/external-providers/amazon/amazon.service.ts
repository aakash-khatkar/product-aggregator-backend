import { Injectable } from '@nestjs/common';
import { AmazonProductStore } from './stores/amazon-product-store.service';

@Injectable()
export class AmazonService {
  constructor(private readonly store: AmazonProductStore) {}

  getProducts() {
    return this.store.getProducts();
  }

  updatePrices() {
    this.store.updatePrices();
  }
}