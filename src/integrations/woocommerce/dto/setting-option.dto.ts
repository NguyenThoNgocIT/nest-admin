import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateSettingOptionDto {
  @ApiProperty()
  @IsString()
  value: string
}

export class BatchSettingOptionDto {
  @ApiProperty({ type: [Object] }) // Using Object generically as creation structure varies or is not standard for settings usually
  @IsOptional()
  create?: any[]

  @ApiProperty({ type: [Object] })
  @IsOptional()
  update?: any[]

  @ApiProperty({ type: [Object] })
  @IsOptional()
  delete?: any[]
}
