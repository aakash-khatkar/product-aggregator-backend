import { Controller, Get } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { MockProduct } from './stores/amazon-product-store.service';

@Controller('external/amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Get('products')
  getProducts(): MockProduct[] {
    return this.amazonService.getProducts();
  }
}