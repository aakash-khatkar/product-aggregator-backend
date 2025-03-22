import { Injectable } from '@nestjs/common';
import { ProductNormalizer } from './product-normalizer.interface';
import { NormalizedProduct } from '../interfaces/normalized-product.interface';

@Injectable()
export class CareemNormalizer implements ProductNormalizer {
  normalize(raw: any): NormalizedProduct {
    return {
      externalId: raw.id,
      name: raw.title,
      description: raw.details,
      price: raw.amount,
      currency: raw.currencyCode,
      availability: raw.inStock,
      lastProviderUpdate: new Date(raw.lastUpdated),
    };
  }
}