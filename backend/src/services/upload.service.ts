
import cloudinary from '@/lib/cloudinary'
import { UploadApiResponse } from 'cloudinary'
import { Readable } from 'node:stream'

export const uploadToCloudinary = (fileStream: Readable): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'posts_social_app',
        transformation: [{ width: 1080, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (result) resolve(result)
        else reject(new Error('Cloudinary Upload Error'))
      }
    )
    fileStream.pipe(stream)
  })
}