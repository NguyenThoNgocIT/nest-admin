import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePaymentGatewayDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  order?: number

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  settings?: any
}
