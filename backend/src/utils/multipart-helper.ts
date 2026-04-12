import { uploadToCloudinary } from '@/services/upload.service'
import { Readable } from 'stream'

interface MultipartPart {
  type: 'file' | 'field'
  fieldname: string
  filename?: string
  file?: Readable
  value?: unknown
  toBuffer?: () => Promise<Buffer>
}

export async function parseCreatePostMultipart(
  parts: AsyncIterableIterator<MultipartPart>
) {
  let content = ''
  let parentId: string | undefined = undefined
  let tagsRaw = ''
  let imageUrl: string | undefined
  let country: string | undefined
  let city: string | undefined

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'image' && part.filename) {
      const cloudRes = await uploadToCloudinary(part.file!)
      imageUrl = cloudRes.secure_url
    } else if (part.type === 'file') {
      await part.toBuffer?.()
    } else {
      const value = part.value as string
      if (part.fieldname === 'content') content = value
      if (part.fieldname === 'parentId') parentId = value
      if (part.fieldname === 'tags') tagsRaw = value
      if (part.fieldname === 'country') country = value
      if (part.fieldname === 'city') city = value
    }
  }

  return { content, parentId, tagsRaw, imageUrl, country, city }
}

export async function parseUpdateProfileMultipart(
  parts: AsyncIterableIterator<MultipartPart>
) {
  let username: string | undefined
  let name: string | undefined
  let bio: string | undefined
  let avatarUrl: string | undefined

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'avatar' && part.filename) {
      const cloudRes = await uploadToCloudinary(part.file!)
      avatarUrl = cloudRes.secure_url
    } else if (part.type === 'file') {
      await part.toBuffer?.()
    } else {
      const value = part.value as string
      if (part.fieldname === 'username') username = value
      if (part.fieldname === 'name') name = value
      if (part.fieldname === 'bio') bio = value
    }
  }

  return { username, name, bio, avatarUrl }
}
