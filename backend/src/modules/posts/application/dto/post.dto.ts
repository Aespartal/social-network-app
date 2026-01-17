import { Static, Type } from '@sinclair/typebox'
import { MAX_POST_CONTENT_LENGTH } from '../../domain/entities/post.entity'

// ========== Input DTOs (Commands) ==========

/**
 * DTO for creating a new post (multipart form data)
 */
export const CreatePostMultipartSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: MAX_POST_CONTENT_LENGTH,
  }),
  parentId: Type.Optional(Type.String()),
  tags: Type.Optional(Type.String()),
  image: Type.Optional(Type.Any()),
})

/**
 * DTO for creating a new post (JSON)
 */
export const CreatePostDTOSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: MAX_POST_CONTENT_LENGTH,
    description: 'Contenido del post',
  }),
  image: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL de imagen adjunta (opcional)',
    })
  ),
  parentId: Type.Optional(
    Type.String({
      description: 'ID del post padre si es una respuesta',
    })
  ),
  authorId: Type.String({
    description: 'ID del autor del post',
  }),
  tags: Type.Optional(
    Type.Array(
      Type.String({
        minLength: 1,
        maxLength: 50,
      }),
      {
        maxItems: 10,
        description: 'Lista de etiquetas (hashtags)',
      }
    )
  ),
})

/**
 * DTO for updating a post (JSON)
 */
export const UpdatePostDTOSchema = Type.Object({
  content: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: MAX_POST_CONTENT_LENGTH,
      description: 'Nuevo contenido del post',
    })
  ),
  image: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'Nueva URL de imagen',
    })
  ),
})

/**
 * DTO for updating a post (multipart form data)
 */
export const UpdatePostMultipartSchema = Type.Object({
  content: Type.Optional(Type.String({ minLength: 1, maxLength: 2000 })),
  image: Type.Optional(Type.Any()),
})

// ========== Output DTOs (ViewModels) ==========

/**
 * Author information for API responses
 */
export const AuthorResponseSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Union([Type.String(), Type.Null()]),
  verified: Type.Optional(Type.Boolean()),
})

/**
 * Parent post information for API responses
 */
export const ParentPostResponseSchema = Type.Object({
  id: Type.String(),
  content: Type.String(),
  author: Type.Object({
    username: Type.String(),
    name: Type.String(),
    avatar: Type.Union([Type.String(), Type.Null()]),
  }),
})

/**
 * Post response DTO (ViewModel)
 * Includes user-specific context (isLiked, isBookmarked)
 */
export const PostResponseSchema = Type.Object({
  id: Type.String({
    description: 'ID único del post',
  }),
  content: Type.String({
    minLength: 1,
    maxLength: MAX_POST_CONTENT_LENGTH,
    description: `Contenido del post (máximo ${MAX_POST_CONTENT_LENGTH} caracteres)`,
  }),
  image: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL de imagen adjunta (opcional)',
    })
  ),
  parentId: Type.Optional(
    Type.String({
      description: 'ID del post padre si es una respuesta',
    })
  ),
  parent: Type.Optional(ParentPostResponseSchema),
  tags: Type.Optional(
    Type.Array(
      Type.String({
        minLength: 1,
        maxLength: 50,
      }),
      {
        maxItems: 10,
        description: 'Lista de etiquetas (hashtags)',
      }
    )
  ),
  createdAt: Type.String({
    description: 'Fecha de creación (ISO 8601)',
  }),
  updatedAt: Type.Optional(
    Type.String({
      description: 'Fecha de última actualización (ISO 8601)',
    })
  ),
  author: AuthorResponseSchema,
  likesCount: Type.Number({
    default: 0,
    description: 'Número total de likes',
  }),
  repliesCount: Type.Number({
    default: 0,
    description: 'Número total de respuestas',
  }),
  bookmarksCount: Type.Number({
    default: 0,
    description: 'Número total de bookmarks',
  }),
  // User-specific context (depends on authenticated user)
  isLiked: Type.Boolean({
    default: false,
    description: 'Si el usuario actual ha dado like',
  }),
  isBookmarked: Type.Boolean({
    default: false,
    description: 'Si el usuario actual ha guardado el post',
  }),
})

/**
 * Pagination metadata
 */
export const PaginationMetaSchema = Type.Object({
  hasMore: Type.Boolean({
    description: 'Indica si hay más resultados disponibles',
  }),
  nextCursor: Type.Union([Type.String(), Type.Null()], {
    description: 'Cursor para la siguiente página (null si no hay más)',
  }),
  total: Type.Optional(
    Type.Number({
      description: 'Total de elementos (opcional)',
    })
  ),
})

/**
 * Paginated posts response
 */
export const PaginatedPostsResponseSchema = Type.Object({
  posts: Type.Array(PostResponseSchema),
  meta: PaginationMetaSchema,
})

// ========== TypeScript Types ==========

export type CreatePostMultipartDTO = Static<typeof CreatePostMultipartSchema>
export type CreatePostDTO = Static<typeof CreatePostDTOSchema>
export type UpdatePostDTO = Static<typeof UpdatePostDTOSchema>
export type UpdatePostMultipartDTO = Static<typeof UpdatePostMultipartSchema>
export type AuthorResponse = Static<typeof AuthorResponseSchema>
export type ParentPostResponse = Static<typeof ParentPostResponseSchema>
export type PostResponseDTO = Static<typeof PostResponseSchema>
export type PaginationMeta = Static<typeof PaginationMetaSchema>
export type PaginatedPostsResponseDTO = Static<
  typeof PaginatedPostsResponseSchema
>
