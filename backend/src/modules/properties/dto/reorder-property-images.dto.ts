import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

class ReorderPropertyImageItemDto {
  @IsString()
  id!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderPropertyImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderPropertyImageItemDto)
  items!: ReorderPropertyImageItemDto[];
}
