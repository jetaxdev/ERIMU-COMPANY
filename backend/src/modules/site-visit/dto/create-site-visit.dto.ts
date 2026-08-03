import { IsDateString, IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSiteVisitDto {
  @IsUUID()
  propertyId!: string;

  @IsString()
  @MaxLength(120)
  fullName!: string;

  @IsString()
  @MaxLength(40)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDateString()
  visitDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
