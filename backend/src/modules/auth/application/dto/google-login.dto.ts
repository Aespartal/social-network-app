import { Type } from '@sinclair/typebox'

export const GoogleLoginDTOSchema = Type.Object({
  token: Type.String({ minLength: 1 }),
})

export type GoogleLoginDTO = typeof GoogleLoginDTOSchema.static
