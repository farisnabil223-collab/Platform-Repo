import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType, ProductVisibility } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type!: ProductType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  searchTitle!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  searchDescription?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  searchKeywords?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seoSlug!: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false, enum: ProductVisibility })
  @IsEnum(ProductVisibility)
  @IsOptional()
  visibility?: ProductVisibility;
}

export class UpdatePriceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  newPrice!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  newDiscountPrice?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
