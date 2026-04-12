import { Type, Static } from '@sinclair/typebox'

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Union([Type.String(), Type.Null()]),
  verified: Type.Boolean(),
})

export type UserType = Static<typeof UserSchema>

export const TokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresIn: Type.String(),
})

export type TokensType = Static<typeof TokensSchema>

export const AuthDataSchema = Type.Object({
  user: UserSchema,
  tokens: TokensSchema,
})

export type AuthDataType = Static<typeof AuthDataSchema>

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  username: Type.String({ minLength: 3, maxLength: 30 }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  password: Type.String({ minLength: 8 }),
  avatar: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
})

export type RegisterBodyType = Static<typeof RegisterBodySchema>

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})

export type LoginBodyType = Static<typeof LoginBodySchema>

export const GoogleLoginBodySchema = Type.Object({
  token: Type.String(),
})

export type GoogleLoginBodyType = Static<typeof GoogleLoginBodySchema>

export const RefreshTokenBodySchema = Type.Object({
  refreshToken: Type.String(),
})

export type RefreshTokenBodyType = Static<typeof RefreshTokenBodySchema>

export const LogoutBodySchema = Type.Object({
  refreshToken: Type.String(),
})

export type LogoutBodyType = Static<typeof LogoutBodySchema>

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
  retryAfter: Type.Optional(Type.Number()),
})
