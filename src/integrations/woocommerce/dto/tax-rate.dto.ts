import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTaxRateDto {
  @ApiProperty()
  @IsString()
  country: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  postcode?: string // Legacy

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string // Legacy

  @ApiProperty()
  @IsArray()
  @IsOptional()
  postcodes?: string[]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  cities?: string[]

  @ApiProperty()
  @IsString()
  rate: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priority?: number

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  compound?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  shipping?: boolean

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  class?: string
}

export class UpdateTaxRateDto extends PartialType(CreateTaxRateDto) {}

export class BatchTaxRateDto {
  @ApiProperty({ type: [CreateTaxRateDto] })
  @IsOptional()
  create?: CreateTaxRateDto[]

  @ApiProperty({ type: [UpdateTaxRateDto] })
  @IsOptional()
  update?: (UpdateTaxRateDto & { id: number })[]

  @ApiProperty({ type: [Number] })
  @IsOptional()
  delete?: number[]
}
