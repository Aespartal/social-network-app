export interface ImageService {
  /**
   * Uploads an image from a URL to Cloudinary
   * @param url The external image URL
   * @param folder The destination folder in Cloudinary
   */
  uploadFromUrl(url: string, folder: string): Promise<string>
}
