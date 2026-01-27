import { ApiProperty } from '@nestjs/swagger'

export class SystemStatusToolDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  action: string

  @ApiProperty()
  description: string

  @ApiProperty({ required: false })
  success?: boolean

  @ApiProperty({ required: false })
  message?: string
}

export class RunSystemStatusToolDto {
  @ApiProperty({ description: 'Confirm execution of the tool', default: true })
  confirm: boolean
}
