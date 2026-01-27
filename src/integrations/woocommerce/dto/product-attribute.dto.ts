import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

/**
 * CREATE
 */
export class CreateProductAttributeDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  order_by?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  has_archives?: boolean
}

/**
 * UPDATE (không có id)
 */
export class UpdateProductAttributeDto extends CreateProductAttributeDto {}

/**
 * UPDATE + ID (dùng cho batch update)
 */
export class UpdateProductAttributeWithIdDto extends UpdateProductAttributeDto {
  @ApiProperty()
  @IsNumber()
  id: number
}

/**
 * BATCH
 */
export class BatchProductAttributeDto {
  @ApiPropertyOptional({ type: [CreateProductAttributeDto] })
  @IsArray()
  @IsOptional()
  create?: CreateProductAttributeDto[]

  @ApiPropertyOptional({ type: [UpdateProductAttributeWithIdDto] })
  @IsArray()
  @IsOptional()
  update?: UpdateProductAttributeWithIdDto[]

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  delete?: number[]
}
