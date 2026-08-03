import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SiteVisitController } from './site-visit.controller';
import { SiteVisitService } from './site-visit.service';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [SiteVisitController],
	providers: [SiteVisitService],
})
export class SiteVisitModule {}
