import { ApiProperty } from '@nestjs/swagger'

export class StateDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  name: string
}

export class CountryStateDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: [StateDto] })
  states: StateDto[]
}

export class ContinentDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: [CountryStateDto] })
  countries: CountryStateDto[]
}

export class CountryDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: [StateDto] })
  states: StateDto[]
}

export class CurrencyDto {
  @ApiProperty()
  code: string

  @ApiProperty()
  name: string

  @ApiProperty()
  symbol: string
}

export class DataResourceDto {
  @ApiProperty()
  slug: string

  @ApiProperty()
  description: string
}
