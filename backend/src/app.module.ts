import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CompanyModule } from './modules/company/company.module';
import { FaqModule } from './modules/faq/faq.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { SeoModule } from './modules/seo/seo.module';
import { SiteVisitModule } from './modules/site-visit/site-visit.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    ActivityLogModule,
    AnalyticsModule,
    AuthModule,
    BlogsModule,
    CompanyModule,
    FaqModule,
    GalleryModule,
    HomepageModule,
    InquiriesModule,
    PropertiesModule,
    SeoModule,
    SiteVisitModule,
    TestimonialsModule,
    UploadModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
