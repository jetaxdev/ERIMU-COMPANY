import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  private readonly resend: Resend | null;

  constructor(private readonly prisma: PrismaService) {
    this.resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  }

  async create(dto: CreateInquiryDto) {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        emails: true,
      },
    });

    const inquiry = await this.prisma.inquiry.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        message: dto.message.trim(),
        companyId: company?.id || null,
      },
    });

    const companyEmail = this.pickCompanyEmail(company?.emails || [], company?.email || null);
    const emailSent = await this.sendInquiryEmail(company?.name || 'ERIMU Ventures', companyEmail, dto);

    return {
      inquiry,
      emailSent,
      emailTarget: companyEmail,
    };
  }

  async findAll() {
    const inquiries = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        company: { select: { id: true, name: true, email: true, emails: true } },
      },
    });

    return {
      data: inquiries,
      meta: {
        total: inquiries.length,
      },
    };
  }

  private pickCompanyEmail(emails: string[], fallback: string | null) {
    const firstEmail = emails.find((email) => email.trim().length > 0)?.trim().toLowerCase();
    if (firstEmail) {
      return firstEmail;
    }

    if (fallback?.trim()) {
      return fallback.trim().toLowerCase();
    }

    return null;
  }

  private async sendInquiryEmail(companyName: string, companyEmail: string | null, dto: CreateInquiryDto) {
    if (!this.resend || !companyEmail) {
      return false;
    }

    const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';
    const subject = dto.subject?.trim() || `New Inquiry from ${dto.fullName.trim()}`;

    const lines = [
      `Name: ${dto.fullName.trim()}`,
      `Email: ${dto.email.trim()}`,
      dto.phone?.trim() ? `Phone: ${dto.phone.trim()}` : null,
      dto.subject?.trim() ? `Subject: ${dto.subject.trim()}` : null,
      '',
      'Message:',
      dto.message.trim(),
    ].filter((line): line is string => Boolean(line));

    try {
      await this.resend.emails.send({
        from: fromEmail,
        to: companyEmail,
        reply_to: dto.email.trim(),
        subject,
        text: `${companyName} Contact Inquiry\n\n${lines.join('\n')}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to send inquiry email', error);
      return false;
    }
  }
}
