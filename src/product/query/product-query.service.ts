import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FilterProductsDto } from '../dto/filter-products.dto';
import { ProductChangeFilterDto } from '../dto/product-changes.dto';
import { ProductRepository } from '../repositories/product.repository';
import { ProductHistoryRepository } from '../repositories/product-history.repository';

@Injectable()
export class ProductQueryService {
  constructor(private readonly prisma: PrismaService ,  private readonly productRepository: ProductRepository,  private readonly productHistoryRepository: ProductHistoryRepository,) {}

  async findProducts(filter: FilterProductsDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const { data, total } = await this.productRepository.findFilteredProducts(filter);
  
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductDetail(id: string) {
    const product = await this.productRepository.findByIdWithLinks(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
  
  async getChangedProducts(filter: ProductChangeFilterDto) {
    return this.productHistoryRepository.getChangedProducts(filter);
  }
}