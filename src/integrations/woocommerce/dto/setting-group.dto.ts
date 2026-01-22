import { ApiProperty } from '@nestjs/swagger'

export class SettingGroupDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  label: string

  @ApiProperty()
  description: string

  @ApiProperty()
  parent_id: string

  @ApiProperty()
  sub_groups: string[]
}
