import { Type, Static } from '@sinclair/typebox'

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'ID único del usuario' }),
  username: Type.String({
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_]+$',
    description:
      'Nombre de usuario único (solo letras, números y guiones bajos)',
  }),
  email: Type.String({
    format: 'email',
    description: 'Email del usuario',
  }),
  name: Type.String({
    minLength: 1,
    maxLength: 100,
    description: 'Nombre completo del usuario',
  }),
  bio: Type.Optional(
    Type.String({
      maxLength: 500,
      description: 'Biografía del usuario (opcional)',
    })
  ),
  avatarUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL del avatar del usuario (opcional)',
    })
  ),
  isVerified: Type.Boolean({
    description: 'Indica si el usuario está verificado',
  }),
  followersCount: Type.Number({
    minimum: 0,
    description: 'Número de seguidores',
  }),
  followingCount: Type.Number({
    minimum: 0,
    description: 'Número de usuarios seguidos',
  }),
  createdAt: Type.String({
    format: 'date-time',
    description: 'Fecha de creación de la cuenta',
  }),
  updatedAt: Type.String({
    format: 'date-time',
    description: 'Fecha de última actualización',
  }),
})

export const UserPrivateSchema = Type.Intersect([
  UserSchema,
  Type.Object({
    emailVerified: Type.Boolean({ description: 'Email verificado' }),
    lastLoginAt: Type.Optional(
      Type.String({
        format: 'date-time',
        description: 'Última fecha de login',
      })
    ),
  }),
])

export const RegisterUserSchema = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_]+$',
    description:
      'Nombre de usuario único (solo letras, números y guiones bajos)',
  }),
  email: Type.String({
    format: 'email',
    description: 'Email válido',
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 128,
    description: 'Contraseña (mínimo 8 caracteres)',
  }),
  name: Type.String({
    minLength: 1,
    maxLength: 100,
    description: 'Nombre completo',
  }),
  bio: Type.Optional(
    Type.String({
      maxLength: 500,
      description: 'Biografía opcional',
    })
  ),
})

export const LoginUserSchema = Type.Object({
  email: Type.String({
    format: 'email',
    description: 'Email del usuario',
  }),
  password: Type.String({
    minLength: 1,
    description: 'Contraseña del usuario',
  }),
})

export const UpdateUserSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: 100,
      description: 'Nombre completo',
    })
  ),
  bio: Type.Optional(
    Type.String({
      maxLength: 500,
      description: 'Biografía',
    })
  ),
  avatarUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL del avatar',
    })
  ),
})

export const ChangePasswordSchema = Type.Object({
  currentPassword: Type.String({
    minLength: 1,
    description: 'Contraseña actual',
  }),
  newPassword: Type.String({
    minLength: 8,
    maxLength: 128,
    description: 'Nueva contraseña (mínimo 8 caracteres)',
  }),
})

export const AuthResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    user: UserSchema,
    token: Type.String({ description: 'JWT token de autenticación' }),
    expiresIn: Type.String({ description: 'Tiempo de expiración del token' }),
  }),
})

export const UserParamsSchema = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 30,
    description: 'Nombre de usuario',
  }),
})

export type User = Static<typeof UserSchema>
export type UserPrivate = Static<typeof UserPrivateSchema>
export type RegisterUser = Static<typeof RegisterUserSchema>
export type LoginUser = Static<typeof LoginUserSchema>
export type UpdateUser = Static<typeof UpdateUserSchema>
export type ChangePassword = Static<typeof ChangePasswordSchema>
export type AuthResponse = Static<typeof AuthResponseSchema>
export type UserParams = Static<typeof UserParamsSchema>
