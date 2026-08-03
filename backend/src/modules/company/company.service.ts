import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile() {
    return this.prisma.company.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const slug = await this.generateUniqueSlug(createCompanyDto.slug || createCompanyDto.name);
    const data = this.toCreateData(createCompanyDto, slug);

    return this.prisma.company.create({
      data,
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    const data = this.toUpdateData(updateCompanyDto);

    if (updateCompanyDto.name) {
      data.name = updateCompanyDto.name.trim();
    }

    if (updateCompanyDto.slug || updateCompanyDto.name) {
      const candidateSlug = updateCompanyDto.slug || updateCompanyDto.name;
      data.slug = await this.generateUniqueSlug(candidateSlug as string, id);
    }

    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.company.delete({ where: { id } });
  }

  private async generateUniqueSlug(input: string, excludingId?: string) {
    const base = this.slugify(input);
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.company.findUnique({ where: { slug } });
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

    return normalized || `company-${Date.now()}`;
  }

  private toCreateData(dto: CreateCompanyDto, slug: string): Prisma.CompanyCreateInput {
    const phones = this.cleanPhones(dto.phones ?? []);
    const emails = this.cleanEmails(dto.emails ?? []);
    const socialLinks = this.toSocialLinks(dto.socialLinks);
    const firstSocialLinkUrl = dto.socialLinks?.[0]?.url?.trim() || null;

    return {
      name: dto.name.trim(),
      slug,
      logoUrl: this.trimToNullable(dto.logoUrl),
      address: this.trimToNullable(dto.address),
      googleMapsUrl: this.trimToNullable(dto.googleMapsUrl),
      mission: this.trimToNullable(dto.mission),
      vision: this.trimToNullable(dto.vision),
      about: this.trimToNullable(dto.about),
      description: this.trimToNullable(dto.about),
      phones,
      phone: phones[0] || null,
      emails,
      email: emails[0] || null,
      socialLinks: socialLinks ?? Prisma.JsonNull,
      website: firstSocialLinkUrl,
    };
  }

  private toUpdateData(dto: UpdateCompanyDto): Prisma.CompanyUpdateInput {
    const result: Prisma.CompanyUpdateInput = {};

    if (dto.logoUrl !== undefined) {
      result.logoUrl = this.trimToNullable(dto.logoUrl);
    }

    if (dto.address !== undefined) {
      result.address = this.trimToNullable(dto.address);
    }

    if (dto.googleMapsUrl !== undefined) {
      result.googleMapsUrl = this.trimToNullable(dto.googleMapsUrl);
    }

    if (dto.mission !== undefined) {
      result.mission = this.trimToNullable(dto.mission);
    }

    if (dto.vision !== undefined) {
      result.vision = this.trimToNullable(dto.vision);
    }

    if (dto.about !== undefined) {
      result.about = this.trimToNullable(dto.about);
      result.description = this.trimToNullable(dto.about);
    }

    if (dto.phones !== undefined) {
      const cleaned = this.cleanPhones(dto.phones);
      result.phones = cleaned;
      result.phone = cleaned[0] || null;
    }

    if (dto.emails !== undefined) {
      const cleaned = this.cleanEmails(dto.emails);
      result.emails = cleaned;
      result.email = cleaned[0] || null;
    }

    if (dto.socialLinks !== undefined) {
      const socialLinks = this.toSocialLinks(dto.socialLinks);
      const firstSocialLinkUrl = dto.socialLinks[0]?.url?.trim() || null;
      result.socialLinks = socialLinks ?? Prisma.JsonNull;
      result.website = firstSocialLinkUrl;
    }

    return result;
  }

  private trimToNullable(value: string | undefined) {
    return value?.trim() || null;
  }

  private cleanPhones(phones: string[]) {
    return phones.map((phone) => phone.trim()).filter((phone) => phone.length > 0);
  }

  private cleanEmails(emails: string[]) {
    return emails.map((email) => email.trim().toLowerCase()).filter((email) => email.length > 0);
  }

  private toSocialLinks(links: { platform: string; url: string }[] | undefined): Prisma.InputJsonValue | null {
    if (!links?.length) {
      return null;
    }

    return links.map((link) => ({
      platform: link.platform.trim(),
      url: link.url.trim(),
    })) as unknown as Prisma.InputJsonValue;
  }
}
