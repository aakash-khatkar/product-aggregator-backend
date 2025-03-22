import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  @ApiProperty({ example: 'provider-uuid', description: 'Unique ID of the provider' })
  id: string;

  @ApiProperty({ example: 'Noon', description: 'Name of the provider' })
  name: string;
}

export class ProductHistoryDto {
  @ApiProperty({ example: 99.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: true, description: 'Availability of the product' })
  availability: boolean;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Date when the product was last changed' })
  changedAt: Date;
}

export class ProviderLinkDetailDto {
  @ApiProperty({ example: 'link-uuid', description: 'Unique ID of the provider link' })
  id: string;

  @ApiProperty({ example: 'external-uuid', description: 'External ID of the provider link' })
  externalId: string;

  @ApiProperty({ example: 99.99, description: 'Price offered by the provider' })
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the price' })
  currency: string;

  @ApiProperty({ example: true, description: 'Availability of the product from the provider' })
  availability: boolean;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Last update time from the provider' })
  lastProviderUpdate: Date;

  @ApiProperty({ type: ProviderDto, description: 'Details of the provider' })
  provider: ProviderDto;

  @ApiProperty({ type: [ProductHistoryDto], description: 'History of price changes' })
  history: ProductHistoryDto[];
}

export class ProductDetailResponseDto {
  @ApiProperty({ example: 'product-uuid', description: 'Unique ID of the product' })
  id: string;

  @ApiProperty({ example: 'Sample Product', description: 'Name of the product' })
  name: string;

  @ApiProperty({ example: 'This is a sample product description.', description: 'Description of the product' })
  description: string;

  @ApiProperty({ example: true, description: 'Indicates if the product is active' })
  isActive: boolean;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Creation date of the product' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Last update date of the product' })
  updatedAt: Date;

  @ApiProperty({ type: [ProviderLinkDetailDto], description: 'List of provider links for the product' })
  providerLinks: ProviderLinkDetailDto[];
}