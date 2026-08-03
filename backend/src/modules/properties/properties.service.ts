import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UploadService } from '../upload/services/upload.service';
import { PROPERTY_AMENITIES, PropertyAmenityName } from './constants/property-amenities';
import { AddPropertyImageDto } from './dto/add-property-image.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyQueryDto } from './dto/property-query.dto';
import { ReorderPropertyImagesDto } from './dto/reorder-property-images.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(query: PropertyQueryDto) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          amenities: { orderBy: { createdAt: 'asc' } },
          featuredImage: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { orderBy: { createdAt: 'asc' } },
        featuredImage: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async findBySlug(slug: string) {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { orderBy: { createdAt: 'asc' } },
        featuredImage: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async create(createPropertyDto: CreatePropertyDto) {
    const slug = await this.generateUniqueSlug(createPropertyDto.slug || createPropertyDto.title);
    const amenities = this.normalizeAmenities(createPropertyDto.amenities);

    const property = await this.prisma.property.create({
      data: {
        title: createPropertyDto.title.trim(),
        slug,
        description: this.trimToNullable(createPropertyDto.description),
        price: createPropertyDto.price,
        location: this.trimToNullable(createPropertyDto.location),
        county: this.trimToNullable(createPropertyDto.county),
        town: this.trimToNullable(createPropertyDto.town),
        bedrooms: createPropertyDto.bedrooms,
        bathrooms: createPropertyDto.bathrooms,
        areaSqft: createPropertyDto.areaSqft,
        plotSize: this.trimToNullable(createPropertyDto.plotSize),
        type: this.trimToNullable(createPropertyDto.type),
        status: createPropertyDto.status || PropertyStatus.COMING_SOON,
        featured: createPropertyDto.featured || false,
        googleMapsUrl: this.trimToNullable(createPropertyDto.googleMapsUrl),
        latitude: createPropertyDto.latitude,
        longitude: createPropertyDto.longitude,
        amenities: {
          create: amenities.map((name) => ({ name })),
        },
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { orderBy: { createdAt: 'asc' } },
        featuredImage: true,
      },
    });

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    await this.findOne(id);

    const data: Prisma.PropertyUpdateInput = {};

    if (updatePropertyDto.description !== undefined) {
      data.description = this.trimToNullable(updatePropertyDto.description);
    }

    if (updatePropertyDto.price !== undefined) {
      data.price = updatePropertyDto.price;
    }

    if (updatePropertyDto.location !== undefined) {
      data.location = this.trimToNullable(updatePropertyDto.location);
    }

    if (updatePropertyDto.county !== undefined) {
      data.county = this.trimToNullable(updatePropertyDto.county);
    }

    if (updatePropertyDto.town !== undefined) {
      data.town = this.trimToNullable(updatePropertyDto.town);
    }

    if (updatePropertyDto.bedrooms !== undefined) {
      data.bedrooms = updatePropertyDto.bedrooms;
    }

    if (updatePropertyDto.bathrooms !== undefined) {
      data.bathrooms = updatePropertyDto.bathrooms;
    }

    if (updatePropertyDto.areaSqft !== undefined) {
      data.areaSqft = updatePropertyDto.areaSqft;
    }

    if (updatePropertyDto.plotSize !== undefined) {
      data.plotSize = this.trimToNullable(updatePropertyDto.plotSize);
    }

    if (updatePropertyDto.type !== undefined) {
      data.type = this.trimToNullable(updatePropertyDto.type);
    }

    if (updatePropertyDto.status !== undefined) {
      data.status = updatePropertyDto.status;
    }

    if (updatePropertyDto.featured !== undefined) {
      data.featured = updatePropertyDto.featured;
    }

    if (updatePropertyDto.googleMapsUrl !== undefined) {
      data.googleMapsUrl = this.trimToNullable(updatePropertyDto.googleMapsUrl);
    }

    if (updatePropertyDto.latitude !== undefined) {
      data.latitude = updatePropertyDto.latitude;
    }

    if (updatePropertyDto.longitude !== undefined) {
      data.longitude = updatePropertyDto.longitude;
    }

    if (updatePropertyDto.title !== undefined) {
      data.title = updatePropertyDto.title.trim();
    }

    if (updatePropertyDto.slug || updatePropertyDto.title) {
      data.slug = await this.generateUniqueSlug(
        updatePropertyDto.slug || updatePropertyDto.title || 'property',
        id,
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (updatePropertyDto.amenities !== undefined) {
        const amenities = this.normalizeAmenities(updatePropertyDto.amenities);

        await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });

        if (amenities.length > 0) {
          await tx.propertyAmenity.createMany({
            data: amenities.map((name) => ({ propertyId: id, name })),
            skipDuplicates: true,
          });
        }
      }

      return tx.property.update({
        where: { id },
        data,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          amenities: { orderBy: { createdAt: 'asc' } },
          featuredImage: true,
        },
      });
    });

    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.property.delete({ where: { id } });
  }

  async addImage(propertyId: string, dto: AddPropertyImageDto, file?: Express.Multer.File) {
    const property = await this.findOne(propertyId);

    const uploadedFile = file
      ? await this.uploadService.upload(file, {
          folder: `erimu/properties/${property.slug}`,
        })
      : null;

    const imageUrl = dto.imageUrl?.trim() || uploadedFile?.url;

    if (!imageUrl) {
      throw new BadRequestException('Provide imageUrl or upload a file');
    }

    const lastImage = await this.prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { sortOrder: 'desc' },
    });

    const image = await this.prisma.propertyImage.create({
      data: {
        propertyId,
        url: imageUrl,
        caption: this.trimToNullable(dto.caption),
        sortOrder: (lastImage?.sortOrder || -1) + 1,
      },
    });

    if (dto.isFeatured || !property.featuredImageId) {
      await this.prisma.property.update({
        where: { id: propertyId },
        data: { featuredImageId: image.id },
      });
    }

    return this.findOne(propertyId);
  }

  async deleteImage(propertyId: string, imageId: string) {
    const property = await this.findOne(propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
    });

    if (!image) {
      throw new NotFoundException('Property image not found');
    }

    await this.prisma.propertyImage.delete({ where: { id: imageId } });

    if (property.featuredImageId === imageId) {
      const nextFeatured = await this.prisma.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: 'asc' },
      });

      await this.prisma.property.update({
        where: { id: propertyId },
        data: { featuredImageId: nextFeatured?.id || null },
      });
    }

    return this.findOne(propertyId);
  }

  async reorderImages(propertyId: string, dto: ReorderPropertyImagesDto) {
    await this.findOne(propertyId);

    const ids = dto.items.map((item) => item.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new BadRequestException('Duplicate image ids in reorder payload');
    }

    const images = await this.prisma.propertyImage.findMany({
      where: { propertyId, id: { in: ids } },
      select: { id: true },
    });

    if (images.length !== ids.length) {
      throw new BadRequestException('Some images do not belong to this property');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.propertyImage.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return this.findOne(propertyId);
  }

  async setFeaturedImage(propertyId: string, imageId: string) {
    await this.findOne(propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
      select: { id: true },
    });

    if (!image) {
      throw new NotFoundException('Property image not found');
    }

    await this.prisma.property.update({
      where: { id: propertyId },
      data: { featuredImageId: imageId },
    });

    return this.findOne(propertyId);
  }

  private buildWhere(query: PropertyQueryDto): Prisma.PropertyWhereInput {
    const where: Prisma.PropertyWhereInput = {};

    if (query.q?.trim()) {
      const q = query.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { county: { contains: q, mode: 'insensitive' } },
        { town: { contains: q, mode: 'insensitive' } },
        { plotSize: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.county?.trim()) {
      where.county = { contains: query.county.trim(), mode: 'insensitive' };
    }

    if (query.town?.trim()) {
      where.town = { contains: query.town.trim(), mode: 'insensitive' };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};

      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }

      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    return where;
  }

  private normalizeAmenities(input: PropertyAmenityName[] | undefined) {
    const normalized = Array.from(new Set((input || []).map((item) => item.trim().toUpperCase())));

    const invalid = normalized.filter((item) => !PROPERTY_AMENITIES.includes(item as PropertyAmenityName));

    if (invalid.length > 0) {
      throw new BadRequestException(`Invalid amenities: ${invalid.join(', ')}`);
    }

    return normalized as PropertyAmenityName[];
  }

  private trimToNullable(value?: string) {
    return value?.trim() || null;
  }

  private async generateUniqueSlug(input: string, excludingId?: string) {
    const base = this.slugify(input);
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.property.findUnique({ where: { slug } });

      if (!existing || existing.id === excludingId) {
        return slug;
      }

      counter += 1;
      slug = `${base}-${counter}`;
    }
  }

  private slugify(value: string) {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return normalized || `property-${Date.now()}`;
  }
}
