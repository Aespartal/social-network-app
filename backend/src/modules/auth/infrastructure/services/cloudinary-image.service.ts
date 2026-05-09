import { inject, injectable } from 'inversify'
import { v2 as cloudinary } from 'cloudinary'
import { ImageService } from '../../domain/services/image.service.interface'
import { config } from '@/config/env'
import type { Logger } from '@/lib/logger/logger.interface'
import { TYPES } from '@/lib/di-types'

@injectable()
export class CloudinaryImageService implements ImageService {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {
    cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
      secure: true,
    })
  }

  async uploadFromUrl(url: string, folder: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: folder,
        transformation: [
          {
            width: 400,
            height: 400,
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
          },
        ],
      })
      return result.secure_url
    } catch (error) {
      this.logger.error('Error uploading to Cloudinary:', { error })
      return url
    }
  }
}
