import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [GalleryController],
	providers: [GalleryService],
})
export class GalleryModule {}
