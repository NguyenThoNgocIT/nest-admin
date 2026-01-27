import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateOrderRefundLineItemDto {
  @ApiProperty()
  @IsNumber()
  id: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  refund_total?: number

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  refund_tax?: {
    id: number
    refund_total: number
  }[]
}

export class CreateOrderRefundDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  amount?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string

  @ApiPropertyOptional({ type: [CreateOrderRefundLineItemDto] })
  @IsArray()
  @IsOptional()
  line_items?: CreateOrderRefundLineItemDto[]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  api_refund?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  api_restock?: boolean
}
