import { IsString, IsUrl } from 'class-validator';

export class SocialLinkDto {
  @IsString()
  platform!: string;

  @IsUrl()
  url!: string;
}
