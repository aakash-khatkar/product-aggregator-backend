import { Controller, Get } from '@nestjs/common';
import { NoonService } from './noon.service';
import { MockProduct } from './stores/noon-product-store.service';

@Controller('external/noon')
export class NoonController {
  constructor(private readonly noonService: NoonService) {}

  @Get('products')
  getProducts(): MockProduct[] {
    return this.noonService.getProducts();
  }
}