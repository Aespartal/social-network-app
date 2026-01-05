import { uploadToCloudinary } from "@/services/upload.service"

export async function extractPostData(parts: AsyncIterableIterator<any>) {
  let content = ''
  let parentId: string | null = null
  let tagsRaw = ''
  let imageUrl: string | undefined

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'image' && part.filename) {
      const cloudRes = await uploadToCloudinary(part.file)
      imageUrl = cloudRes.secure_url
    } else if (part.type === 'file') {
      await part.toBuffer() // Limpiar streams no usados
    } else {
      const value = part.value as string
      if (part.fieldname === 'content') content = value
      if (part.fieldname === 'parentId') parentId = value
      if (part.fieldname === 'tags') tagsRaw = value
    }
  }

  return { content, parentId, tagsRaw, imageUrl }
}