import { uploadToCloudinary } from '@/services/upload.service'

export async function parseCreatePostMultipart(
  parts: AsyncIterableIterator<any>
) {
  let content = ''
  let parentId: string | undefined = undefined
  let tagsRaw = ''
  let imageUrl: string | undefined

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'image' && part.filename) {
      const cloudRes = await uploadToCloudinary(part.file)
      imageUrl = cloudRes.secure_url
    } else if (part.type === 'file') {
      await part.toBuffer()
    } else {
      const value = part.value as string
      if (part.fieldname === 'content') content = value
      if (part.fieldname === 'parentId') parentId = value
      if (part.fieldname === 'tags') tagsRaw = value
    }
  }

  return { content, parentId, tagsRaw, imageUrl }
}

export async function parseUpdateProfileMultipart(
  parts: AsyncIterableIterator<any>
) {
  let username: string | undefined
  let name: string | undefined
  let bio: string | undefined
  let avatarUrl: string | undefined

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'avatar' && part.filename) {
      const cloudRes = await uploadToCloudinary(part.file)
      avatarUrl = cloudRes.secure_url
    } else if (part.type === 'file') {
      await part.toBuffer()
    } else {
      const value = part.value as string
      if (part.fieldname === 'username') username = value
      if (part.fieldname === 'name') name = value
      if (part.fieldname === 'bio') bio = value
    }
  }

  return { username, name, bio, avatarUrl }
}
