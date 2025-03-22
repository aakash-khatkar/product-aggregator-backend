import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductQueryService } from './query/product-query.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { ProductChangeResponseDto } from './dto/product-change-response.dto';
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';
import { ProductListResponseDto } from './dto/product-list-response.dto';
import { ProductChangeFilterDto } from './dto/product-changes.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productQueryService: ProductQueryService) { }


  @Get('/changes')
  @ApiOkResponse({ type: ProductChangeResponseDto })
  async getChangedProducts(@Query() query: ProductChangeFilterDto) {
    return this.productQueryService.getChangedProducts(query);
  }


  @Get(':id')
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiOkResponse({ type: ProductDetailResponseDto })
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productQueryService.getProductDetail(id);
  }

  @Get()
  @ApiOkResponse({ type: ProductListResponseDto })
  async getProducts(@Query() filter: FilterProductsDto) {
    return await this.productQueryService.findProducts(filter);
  }

}