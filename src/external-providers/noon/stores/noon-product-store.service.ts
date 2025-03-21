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
        id: '8a635367-1432-47f9-a57f-8a145fb44592',
        name: 'Course-101',
        description: 'Learn something at Noon',
        price: 19.99,
        currency: 'USD',
        availability: true,
        lastUpdated: now,
      },
      {
        id: 'a917256b-551d-449d-8d9e-b26ec437df06',
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