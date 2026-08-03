import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { AddPropertyImageDto } from './dto/add-property-image.dto';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyQueryDto } from './dto/property-query.dto';
import { ReorderPropertyImagesDto } from './dto/reorder-property-images.dto';
import { SetFeaturedImageDto } from './dto/set-featured-image.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(@Query() query: PropertyQueryDto) {
    return this.propertiesService.findAll(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.propertiesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @AdminOnly()
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @AdminOnly()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @AdminOnly()
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Param('id') id: string,
    @Body() dto: AddPropertyImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.propertiesService.addImage(id, dto, file);
  }

  @AdminOnly()
  @Delete(':id/images/:imageId')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.propertiesService.deleteImage(id, imageId);
  }

  @AdminOnly()
  @Patch(':id/images/reorder')
  reorderImages(@Param('id') id: string, @Body() dto: ReorderPropertyImagesDto) {
    return this.propertiesService.reorderImages(id, dto);
  }

  @AdminOnly()
  @Patch(':id/images/featured')
  setFeaturedImage(@Param('id') id: string, @Body() dto: SetFeaturedImageDto) {
    return this.propertiesService.setFeaturedImage(id, dto.imageId);
  }
}
