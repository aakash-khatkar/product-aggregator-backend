import { Injectable } from '@nestjs/common';

export interface MockProduct {
  id: string;
  title: string;
  details: string;
  amount: number;
  currencyCode: string;
  inStock: boolean;
  lastUpdated: string;
}

@Injectable()
export class AmazonProductStore {
  private products: MockProduct[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    const now = new Date().toISOString();
    this.products = [
      {
        id: 'uuid-amazon-1',
        title: 'Course-101',
        details: 'Learn something at Noon',
        amount: 19.99,
        currencyCode: 'USD',
        inStock: true,
        lastUpdated: now,
      },
      {
        id: 'uuid-amazon-2',
        title: 'E-Book',
        details: 'Digital reading material',
        amount: 9.99,
        currencyCode: 'USD',
        inStock: true,
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
        amount: parseFloat((product.amount * (0.9 + Math.random() * 0.2)).toFixed(2)),
        inStock: Math.random() > 0.2,
        lastUpdated: now,
      };
      return updated;
    });
  }
}