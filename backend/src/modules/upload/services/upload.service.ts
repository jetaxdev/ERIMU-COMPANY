import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async upload(
    file: Express.Multer.File,
    options?: {
      folder?: string;
      publicId?: string;
      overwrite?: boolean;
    },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('A file is required for upload');
    }

    const result = await this.cloudinaryService.uploadBuffer(file, {
      folder: options?.folder || 'erimu/uploads',
      publicId: options?.publicId,
      overwrite: options?.overwrite,
      resourceType: 'image',
    });

    return {
      message: 'Upload successful',
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }
}
