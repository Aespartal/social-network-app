import { Type } from '@sinclair/typebox'

export const RegisterDTOSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  username: Type.String({ minLength: 3, maxLength: 30 }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  password: Type.String({ minLength: 8, maxLength: 100 }),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
})

export type RegisterDTO = typeof RegisterDTOSchema.static
