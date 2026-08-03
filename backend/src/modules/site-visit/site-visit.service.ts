import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSiteVisitDto } from './dto/create-site-visit.dto';

@Injectable()
export class SiteVisitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSiteVisitDto) {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    const siteVisit = await this.prisma.siteVisit.create({
      data: {
        propertyId: dto.propertyId,
        fullName: dto.fullName.trim(),
        email: dto.email?.trim().toLowerCase() || null,
        phone: dto.phone.trim(),
        notes: dto.notes?.trim() || null,
        visitDate: new Date(dto.visitDate),
        companyId: company?.id || null,
      },
      include: {
        property: { select: { id: true, title: true, slug: true } },
      },
    });

    return { siteVisit };
  }

  async findAll() {
    const data = await this.prisma.siteVisit.findMany({
      orderBy: [{ visitDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        property: { select: { id: true, title: true, slug: true, county: true, town: true, location: true } },
        company: { select: { id: true, name: true } },
      },
    });

    return {
      data,
      meta: {
        total: data.length,
      },
    };
  }
}
