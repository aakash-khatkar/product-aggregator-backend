import { Injectable } from '@nestjs/common';
import { ProductNormalizer } from './product-normalizer.interface';
import { NormalizedProduct } from '../interfaces/normalized-product.interface';

@Injectable()
export class NoonNormalizer implements ProductNormalizer {
  normalize(raw: any): NormalizedProduct {
    return {
      externalId: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price,
      currency: raw.currency,
      availability: raw.availability,
      lastProviderUpdate: new Date(raw.lastUpdated),
    };
  }
}