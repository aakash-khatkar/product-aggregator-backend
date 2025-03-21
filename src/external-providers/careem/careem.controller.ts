import { Controller, Get } from '@nestjs/common';
import { CareemService } from './careem.service';
import { MockProduct } from './stores/careem-product-store.service';

@Controller('external/careem')
export class CareemController {
  constructor(private readonly careemService: CareemService) {}

  @Get('products')
  getProducts(): MockProduct[] {
    return this.careemService.getProducts();
  }
}