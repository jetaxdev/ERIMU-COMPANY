import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadBuffer(
    file: Express.Multer.File,
    options?: {
      folder?: string;
      publicId?: string;
      overwrite?: boolean;
      resourceType?: 'image' | 'raw' | 'video' | 'auto';
    },
  ) {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }

    if (!file?.buffer?.length) {
      throw new InternalServerErrorException('File buffer is missing');
    }

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder,
          public_id: options?.publicId,
          overwrite: options?.overwrite,
          resource_type: options?.resourceType || 'image',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(error || new InternalServerErrorException('Cloudinary upload failed'));
            return;
          }

          resolve(result);
        },
      );

      stream.end(file.buffer);
    });
  }

  isConfigured() {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET,
    );
  }
}
