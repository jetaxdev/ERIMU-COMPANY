import { Injectable } from '@nestjs/common';
import { PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalProperties,
      availableProperties,
      reservedProperties,
      soldProperties,
      totalInquiries,
      totalSiteVisits,
      recentProperties,
      recentInquiries,
      upcomingSiteVisits,
    ] =
      await this.prisma.$transaction([
        this.prisma.property.count(),
        this.prisma.property.count({ where: { status: PropertyStatus.AVAILABLE } }),
        this.prisma.property.count({ where: { status: PropertyStatus.RESERVED } }),
        this.prisma.property.count({ where: { status: PropertyStatus.SOLD } }),
        this.prisma.inquiry.count(),
        this.prisma.siteVisit.count(),
        this.prisma.property.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            featuredImage: true,
          },
        }),
        this.prisma.inquiry.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            property: {
              select: {
                title: true,
              },
            },
          },
        }),
        this.prisma.siteVisit.findMany({
          where: {
            visitDate: {
              gte: startOfToday,
            },
          },
          take: 5,
          orderBy: { visitDate: 'asc' },
          include: {
            property: {
              select: {
                title: true,
                location: true,
                county: true,
                town: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        }),
      ]);

    return {
      stats: {
        total: totalProperties,
        available: availableProperties,
        reserved: reservedProperties,
        sold: soldProperties,
      },
      notifications: {
        inquiries: totalInquiries,
        siteVisits: totalSiteVisits,
      },
      recentProperties: recentProperties.map((property) => ({
        id: property.id,
        title: property.title,
        location: property.location,
        county: property.county,
        town: property.town,
        price: property.price,
        status: property.status,
        imageUrl: property.featuredImage?.url || property.images[0]?.url || null,
      })),
      recentInquiries: recentInquiries.map((inquiry) => ({
        id: inquiry.id,
        fullName: inquiry.fullName,
        message: inquiry.message,
        email: inquiry.email,
        propertyTitle: inquiry.property?.title || null,
        createdAt: inquiry.createdAt,
      })),
      upcomingSiteVisits: upcomingSiteVisits.map((visit) => ({
        id: visit.id,
        visitDate: visit.visitDate,
        propertyTitle: visit.property.title,
        propertyLocation: visit.property.location,
        propertyCounty: visit.property.county,
        propertyTown: visit.property.town,
        clientName: visit.fullName || visit.email || visit.user?.fullName || visit.user?.email || 'Unassigned visitor',
      })),
    };
  }
}