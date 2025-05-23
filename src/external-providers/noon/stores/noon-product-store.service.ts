import { Injectable } from '@nestjs/common';

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  availability: boolean;
  lastUpdated: string;
}

@Injectable()
export class NoonProductStore {
  private products: MockProduct[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    const now = new Date().toISOString();
    this.products = [
      {
        id: 'uuid-noon-1',
        name: 'Course-101',
        description: 'Learn something at Noon',
        price: 19.99,
        currency: 'USD',
        availability: true,
        lastUpdated: now,
      },
      {
        id: 'uuid-noon-2',
        name: 'E-Book',
        description: 'Digital reading material',
        price: 9.99,
        currency: 'USD',
        availability: true,
        lastUpdated: now,
      },
    ];
  }

  getProducts() {
    return this.products;
  }

  updatePrices() {
    const now = new Date().toISOString();
    this.products = this.products.map((product) => {
      const updated = {
        ...product,
        price: parseFloat((product.price * (0.9 + Math.random() * 0.2)).toFixed(2)),
        availability: Math.random() > 0.2,
        lastUpdated: now,
      };
      return updated;
    });
  }
}