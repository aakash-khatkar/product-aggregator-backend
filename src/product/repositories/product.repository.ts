import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FilterProductsDto } from '../dto/filter-products.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFilteredProducts(filter: FilterProductsDto) {
    const {
      name,
      minPrice,
      maxPrice,
      available,
      providerId,
      page = 1,
      limit = 20,
    } = filter;

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      providerLinks: {
        some: {
          isActive: true,
          ...(providerId && { providerId }),
          ...(available !== undefined && { availability: available === 'true' }),
          ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
          ...(maxPrice && { price: { ...(minPrice ? { gte: parseFloat(minPrice) } : {}), lte: parseFloat(maxPrice) } }),
        },
      },
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          providerLinks: {
            where: { isActive: true },
            select: {
              id: true,
              externalId: true,
              price: true,
              currency: true,
              availability: true,
              lastProviderUpdate: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async findByIdWithLinks(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        providerLinks: {
          select: {
            id: true,
            externalId: true,
            price: true,
            currency: true,
            availability: true,
            lastProviderUpdate: true,
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
            history: {
              orderBy: { changedAt: 'desc' },
              select: {
                price: true,
                availability: true,
                changedAt: true,
              },
            },
          },
        },
      },
    });
  }
}