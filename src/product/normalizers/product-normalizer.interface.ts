import { NormalizedProduct } from '../interfaces/normalized-product.interface';

export interface ProductNormalizer {
  normalize(raw: any): NormalizedProduct;
}