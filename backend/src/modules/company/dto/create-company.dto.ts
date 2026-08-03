import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { SocialLinkDto } from './social-link.dto';

export class CreateCompanyDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  phones?: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @IsOptional()
  emails?: string[];

  @IsString()
  @IsOptional()
  address?: string;

  @IsUrl()
  @IsOptional()
  googleMapsUrl?: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsString()
  @IsOptional()
  vision?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  @IsOptional()
  socialLinks?: SocialLinkDto[];
}
