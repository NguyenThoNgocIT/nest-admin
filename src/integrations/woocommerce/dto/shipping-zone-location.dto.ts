import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

export enum ShippingLocationType {
  POSTCODE = 'postcode',
  STATE = 'state',
  COUNTRY = 'country',
  CONTINENT = 'continent',
}

export class ShippingZoneLocationDto {
  @ApiProperty()
  @IsString()
  code: string

  @ApiProperty({ enum: ShippingLocationType })
  @IsEnum(ShippingLocationType)
  type: ShippingLocationType
}
