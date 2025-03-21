import { Injectable } from '@nestjs/common';
import { NoonProductStore } from './stores/noon-product-store.service';

@Injectable()
export class NoonService {
  constructor(private readonly store: NoonProductStore) {}

  getProducts() {
    return this.store.getProducts();
  }

  updatePrices() {
    this.store.updatePrices();
  }
}