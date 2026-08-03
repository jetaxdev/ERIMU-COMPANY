import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.gallery.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const categories = [...new Set(data.map((item) => item.category).filter(Boolean))].sort((left, right) => left.localeCompare(right));

    return { data, categories, meta: { total: data.length } };
  }

  async findPublic() {
    return this.findAll();
  }

  async create(dto: CreateGalleryDto) {
    const slug = dto.slug?.trim() || makeSlug(dto.title);

    return this.prisma.gallery.create({
      data: {
        title: dto.title.trim(),
        slug,
        mediaType: dto.mediaType,
        category: dto.category.trim(),
        mediaUrl: dto.mediaUrl.trim(),
        thumbnailUrl: dto.thumbnailUrl?.trim() || null,
        description: dto.description?.trim() || null,
        duration: dto.duration?.trim() || null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateGalleryDto) {
    const payload: Prisma.GalleryUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.slug !== undefined ? { slug: dto.slug.trim() } : {}),
      ...(dto.mediaType !== undefined ? { mediaType: dto.mediaType } : {}),
      ...(dto.category !== undefined ? { category: dto.category.trim() } : {}),
      ...(dto.mediaUrl !== undefined ? { mediaUrl: dto.mediaUrl.trim() } : {}),
      ...(dto.thumbnailUrl !== undefined ? { thumbnailUrl: dto.thumbnailUrl?.trim() || null } : {}),
      ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
      ...(dto.duration !== undefined ? { duration: dto.duration?.trim() || null } : {}),
      ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
    };

    return this.prisma.gallery.update({ where: { id }, data: payload });
  }

  async remove(id: string) {
    return this.prisma.gallery.delete({ where: { id } });
  }
}