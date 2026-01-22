import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export class ProductDimensionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  length?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  width?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  height?: string
}

export class ProductCategoryDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number
}

export class ProductImageDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  src?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alt?: string
}

export class ProductAttributeDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  position?: number

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  visible?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  variation?: boolean

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  options?: string[]
}

export class ProductDefaultAttributeDto {
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

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catalog_visibility?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  short_description?: string

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
  external_url?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  button_text?: string

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
  @IsBoolean()
  @IsOptional()
  sold_individually?: boolean

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weight?: string

  @ApiPropertyOptional({ type: ProductDimensionDto })
  @IsObject()
  @IsOptional()
  dimensions?: ProductDimensionDto

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  shipping_required?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  shipping_taxable?: boolean

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shipping_class?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  shipping_class_id?: number

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  reviews_allowed?: boolean

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  upsell_ids?: number[]

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  cross_sell_ids?: number[]

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parent_id?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchase_note?: string

  @ApiPropertyOptional({ type: [ProductCategoryDto] })
  @IsArray()
  @IsOptional()
  categories?: ProductCategoryDto[]

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: any[]

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsArray()
  @IsOptional()
  images?: ProductImageDto[]

  @ApiPropertyOptional({ type: [ProductAttributeDto] })
  @IsArray()
  @IsOptional()
  attributes?: ProductAttributeDto[]

  @ApiPropertyOptional({ type: [ProductDefaultAttributeDto] })
  @IsArray()
  @IsOptional()
  default_attributes?: ProductDefaultAttributeDto[]

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  menu_order?: number

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  meta_data?: any[]
}

export class UpdateProductDto extends CreateProductDto {}

export class BatchProductDto {
  @ApiPropertyOptional({ type: [CreateProductDto] })
  @IsArray()
  @IsOptional()
  create?: CreateProductDto[]

  @ApiPropertyOptional({ type: [UpdateProductDto] })
  @IsArray()
  @IsOptional()
  update?: (UpdateProductDto & { id: number })[]

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  delete?: number[]
}
