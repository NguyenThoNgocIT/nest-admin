import { ApiProperty } from '@nestjs/swagger'

export class WooCommerceShippingMethodDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string
}
