import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsISO8601, IsOptional, IsInt, Min } from 'class-validator';

export class ProductChangeFilterDto {
  @ApiProperty({ description: 'ISO timestamp string (required)' })
  @IsISO8601()
  since: string;

  @ApiPropertyOptional({ description: 'Page number (optional)', default: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page (optional)', default: 20 })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}