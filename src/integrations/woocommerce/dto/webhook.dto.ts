import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator'

export enum WebhookStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DISABLED = 'disabled',
}

export class CreateWebhookDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  topic: string

  @ApiProperty()
  @IsUrl()
  delivery_url: string

  @ApiProperty({ enum: WebhookStatus, required: false })
  @IsEnum(WebhookStatus)
  @IsOptional()
  status?: WebhookStatus

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secret?: string
}

export class UpdateWebhookDto extends PartialType(CreateWebhookDto) {}

export class BatchWebhookDto {
  @ApiProperty({ type: [CreateWebhookDto] })
  @IsOptional()
  create?: CreateWebhookDto[]

  @ApiProperty({ type: [UpdateWebhookDto] })
  @IsOptional()
  update?: (UpdateWebhookDto & { id: number })[]

  @ApiProperty({ type: [Number] })
  @IsOptional()
  delete?: number[]
}
