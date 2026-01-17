import { Type } from '@sinclair/typebox'

export const RefreshTokenDTOSchema = Type.Object({
  refreshToken: Type.String({ minLength: 1 }),
})

export type RefreshTokenDTO = typeof RefreshTokenDTOSchema.static
