import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUrl()
  @IsNotEmpty()
  url: string

  @IsString()
  @IsNotEmpty()
  consumerKey: string

  @IsString()
  @IsNotEmpty()
  consumerSecret: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}

export class UpdateStoreDto extends CreateStoreDto {}
