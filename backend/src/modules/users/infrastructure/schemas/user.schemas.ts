import { Type } from '@sinclair/typebox'

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  bio: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  verified: Type.Boolean(),
  active: Type.Boolean(),
  role: Type.Union([
    Type.Literal('USER'),
    Type.Literal('MODERATOR'),
    Type.Literal('ADMIN'),
  ]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  counts: Type.Optional(
    Type.Object({
      followers: Type.Number({ minimum: 0 }),
      following: Type.Number({ minimum: 0 }),
      posts: Type.Number({ minimum: 0 }),
      visitsReceived: Type.Number({ minimum: 0 }),
    })
  ),
  isFollowing: Type.Optional(Type.Boolean()),
})

export const UserParamsSchema = Type.Object({
  id: Type.String(),
})

export const CreateUserBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  username: Type.String({ minLength: 3, maxLength: 30 }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  password: Type.String({ minLength: 8 }),
  avatar: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
})

export const UpdateUserBodySchema = Type.Object({
  email: Type.Optional(Type.String({ format: 'email' })),
  username: Type.Optional(Type.String({ minLength: 3, maxLength: 30 })),
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  password: Type.Optional(Type.String({ minLength: 8 })),
  avatar: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
})

export const SuccessResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Any(),
  message: Type.Optional(Type.String()),
})

export const ErrorResponseSchema = Type.Object({
  success: Type.Boolean({ default: false }),
  error: Type.String(),
  code: Type.Optional(Type.String()),
  statusCode: Type.Optional(Type.Number()),
})
