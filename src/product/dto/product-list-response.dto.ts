import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  @ApiProperty({ example: 'provider-uuid', description: 'Unique ID of the provider' })
  id: string;

  @ApiProperty({ example: 'Noon', description: 'Name of the provider' })
  name: string;
}

export class ProviderLinkDto {
  @ApiProperty({ example: 'product-provider-link-uuid', description: 'Unique ID of the provider link' })
  id: string;

  @ApiProperty({ example: 'uuid-noon-1', description: 'External ID of the product provider link' })
  externalId: string;

  @ApiProperty({ example: 19.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the price' })
  currency: string;

  @ApiProperty({ example: true, description: 'Availability of the product' })
  availability: boolean;

  @ApiProperty({ example: true, description: 'Is product stale' })
  isStale: boolean;

  @ApiProperty({ example: '2024-03-22T10:15:00Z', description: 'Last update timestamp from the provider' })
  lastProviderUpdate: Date;

  @ApiProperty({ type: ProviderDto, description: 'Provider information' })
  provider: ProviderDto;
}

export class ProductDto {
  @ApiProperty({ example: 'product-uuid', description: 'Unique ID of the product' })
  id: string;

  @ApiProperty({ example: 'Course-101', description: 'Name of the product' })
  name: string;

  @ApiProperty({ example: 'Learn something at Noon', description: 'Description of the product' })
  description: string;

  @ApiProperty({ type: [ProviderLinkDto], description: 'List of provider links' })
  providerLinks: ProviderLinkDto[];
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductDto], description: 'List of products' })
  data: ProductDto[];

  @ApiProperty({ example: 50, description: 'Total number of products' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 20, description: 'Number of products per page' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total number of pages' })
  totalPages: number;
}