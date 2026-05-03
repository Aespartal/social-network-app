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
  updatedAt: Type.Optional(Type.String()),
  googleId: Type.Optional(Type.String({ format: 'google-id' })),
  active: Type.Boolean(),
  _count: Type.Optional(
    Type.Object({
      posts: Type.Number(),
      followers: Type.Number(),
      following: Type.Number(),
      visitsReceived: Type.Number(),
    })
  ),
  totalXP: Type.Number(),
  currentLevel: Type.Number(),
})

export type UserResponseDTO = Static<typeof UserResponseSchema>
