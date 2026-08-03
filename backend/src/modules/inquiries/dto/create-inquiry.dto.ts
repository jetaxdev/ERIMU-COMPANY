import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;

  @IsString()
  @MaxLength(4000)
  message!: string;
}
