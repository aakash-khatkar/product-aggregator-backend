import { Injectable } from '@nestjs/common';
import { CareemProductStore } from './stores/careem-product-store.service';

@Injectable()
export class CareemService {
  constructor(private readonly store: CareemProductStore) {}

  getProducts() {
    return this.store.getProducts();
  }

  updatePrices() {
    this.store.updatePrices();
  }
}