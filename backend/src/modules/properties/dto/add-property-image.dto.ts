import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class AddPropertyImageDto {
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
