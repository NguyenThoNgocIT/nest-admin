import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateTaxClassDto {
  @ApiProperty()
  @IsString()
  name: string
}

export class TaxClassDto {
  @ApiProperty()
  slug: string

  @ApiProperty()
  name: string
}
