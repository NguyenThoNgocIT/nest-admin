import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { ProductDimensionDto, ProductImageDto } from './product.dto'

export class ProductVariationAttributeDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  option?: string
}

export class CreateProductVariationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sku?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  regular_price?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sale_price?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date_on_sale_from?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date_on_sale_from_gmt?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date_on_sale_to?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date_on_sale_to_gmt?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  virtual?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  downloadable?: boolean

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  downloads?: any[]

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  download_limit?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  download_expiry?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tax_status?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tax_class?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  manage_stock?: boolean

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  stock_quantity?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stock_status?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  backorders?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weight?: string

  @ApiPropertyOptional({ type: ProductDimensionDto })
  @IsObject()
  @IsOptional()
  dimensions?: ProductDimensionDto

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shipping_class?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  shipping_class_id?: number

  @ApiPropertyOptional({ type: ProductImageDto })
  @IsObject()
  @IsOptional()
  image?: ProductImageDto

  @ApiPropertyOptional({ type: [ProductVariationAttributeDto] })
  @IsArray()
  @IsOptional()
  attributes?: ProductVariationAttributeDto[]

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  menu_order?: number

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  meta_data?: any[]
}

export class UpdateProductVariationDto extends CreateProductVariationDto {}

export class BatchProductVariationDto {
  @ApiPropertyOptional({ type: [CreateProductVariationDto] })
  @IsArray()
  @IsOptional()
  create?: CreateProductVariationDto[]

  @ApiPropertyOptional({ type: [UpdateProductVariationDto] })
  @IsArray()
  @IsOptional()
  update?: (UpdateProductVariationDto & { id: number })[]

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  delete?: number[]
}
