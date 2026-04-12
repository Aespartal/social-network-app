import { Static, Type } from '@sinclair/typebox'

export const AuthTokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresIn: Type.String(),
})

export const AuthUserDTOSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Union([Type.String(), Type.Null()]),
  verified: Type.Boolean(),
  bio: Type.Union([Type.String(), Type.Null()]),
})

export const AuthResponseDTOSchema = Type.Object({
  user: AuthUserDTOSchema,
  tokens: Type.Optional(AuthTokensSchema),
})

export type AuthResponseDTO = Static<typeof AuthResponseDTOSchema>
export type AuthTokensDTO = Static<typeof AuthTokensSchema>
export type AuthUserDTO = Static<typeof AuthUserDTOSchema>
