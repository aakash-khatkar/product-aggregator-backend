// src/product/normalizers/normalizer.factory.ts
import { Injectable } from '@nestjs/common';
import { ProductNormalizer } from './product-normalizer.interface';
import { NoonNormalizer } from './noon-normalizer.service';
import { AmazonNormalizer } from './amazon-normalizer.service';
import { CareemNormalizer } from './careem-normalizer.service';

@Injectable()
export class NormalizerFactory {
  constructor(
    private readonly noonNormalizer: NoonNormalizer,
    private readonly amazonNormalizer: AmazonNormalizer,
    private readonly careemNormalizer: CareemNormalizer,
  ) {}

  getNormalizer(provider: string): ProductNormalizer {
    switch (provider.toLowerCase()) {
      case 'noon':
        return this.noonNormalizer;
      case 'amazon':
        return this.amazonNormalizer;
      case 'careem':
        return this.careemNormalizer;
      default:
        throw new Error(`No normalizer registered for provider: ${provider}`);
    }
  }
}