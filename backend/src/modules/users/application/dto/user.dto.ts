import { Static, Type } from '@sinclair/typebox'

export const UserResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.Optional(Type.String({ format: 'email' })),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Union([Type.String(), Type.Null()]),
  bio: Type.Union([Type.String(), Type.Null()]),
  role: Type.String(),
  verified: Type.Boolean(),
  createdAt: Type.String(),
  googleId: Type.Optional(Type.String({ format: 'google-id' })),
})

export type UserResponseDTO = Static<typeof UserResponseSchema>
