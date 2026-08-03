import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { PropertyStatus } from '@prisma/client';
import { PROPERTY_AMENITIES, PropertyAmenityName } from '../constants/property-amenities';

export class CreatePropertyDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  county?: string;

  @IsString()
  @IsOptional()
  town?: string;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  bedrooms?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  bathrooms?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  areaSqft?: number;

  @IsString()
  @IsOptional()
  plotSize?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsOptional()
  @IsUrl()
  googleMapsUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsIn(PROPERTY_AMENITIES, { each: true })
  @ArrayUnique()
  amenities?: PropertyAmenityName[];
}
