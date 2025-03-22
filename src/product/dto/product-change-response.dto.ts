import { ApiProperty } from '@nestjs/swagger';

export class ProductChangeEntryDto {
  @ApiProperty({ example: 'provider-uuid', description: 'Unique ID of the provider' })
  providerId: string;

  @ApiProperty({ example: 'Amazon', description: 'Name of the provider' })
  providerName: string;

  @ApiProperty({ example: 29.99, description: 'Old price of the product' })
  oldPrice: number;

  @ApiProperty({ example: 32.49, description: 'New price of the product' })
  newPrice: number;

  @ApiProperty({ example: true, description: 'Old availability status of the product' })
  oldAvailability: boolean;

  @ApiProperty({ example: false, description: 'New availability status of the product' })
  newAvailability: boolean;

  @ApiProperty({ example: '2025-03-22T06:33:58.086Z', description: 'Timestamp when the change occurred' })
  changedAt: Date;
}

export class ProductChangeDto {
  @ApiProperty({ example: 'product-uuid', description: 'Unique ID of the product' })
  productId: string;

  @ApiProperty({ example: 'Course-101', description: 'Name of the product' })
  productName: string;

  @ApiProperty({ type: [ProductChangeEntryDto], description: 'List of changes made to the product' })
  changes: ProductChangeEntryDto[];
}

export class ProductChangeResponseDto {
  @ApiProperty({ type: [ProductChangeDto], description: 'List of product change details' })
  data: ProductChangeDto[];

  @ApiProperty({ example: 2, description: 'Total number of changes' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 20, description: 'Number of changes per page' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Total number of pages' })
  totalPages: number;
}