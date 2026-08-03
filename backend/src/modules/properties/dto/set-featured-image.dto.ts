import { IsString } from 'class-validator';

export class SetFeaturedImageDto {
  @IsString()
  imageId!: string;
}
