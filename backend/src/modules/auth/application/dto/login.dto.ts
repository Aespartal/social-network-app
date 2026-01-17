import { Type } from '@sinclair/typebox'

export const LoginDTOSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 1 }),
})

export type LoginDTO = typeof LoginDTOSchema.static
