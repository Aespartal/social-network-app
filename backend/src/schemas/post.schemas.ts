import { Type, Static } from '@sinclair/typebox'
import { PaginationSchema, PaginationQuerySchema } from './index'

export const PostAuthorSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  name: Type.String(),
  avatarUrl: Type.Optional(Type.String({ format: 'uri' })),
  isVerified: Type.Boolean(),
})

export const PostSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
    description: 'ID único del post',
  }),
  content: Type.String({
    minLength: 1,
    maxLength: 2000,
    description: 'Contenido del post (máximo 2000 caracteres)',
  }),
  imageUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL de imagen adjunta (opcional)',
    })
  ),
  authorId: Type.String({
    format: 'uuid',
    description: 'ID del autor del post',
  }),
  author: Type.Optional(PostAuthorSchema),
  likesCount: Type.Number({
    minimum: 0,
    description: 'Número total de likes',
  }),
  commentsCount: Type.Number({
    minimum: 0,
    description: 'Número total de comentarios',
  }),
  isLiked: Type.Optional(
    Type.Boolean({
      description:
        'Si el usuario actual ha dado like (solo si está autenticado)',
    })
  ),
  isBookmarked: Type.Optional(
    Type.Boolean({
      description:
        'Si el usuario actual ha guardado el post (solo si está autenticado)',
    })
  ),
  createdAt: Type.String({
    format: 'date-time',
    description: 'Fecha de creación del post',
  }),
  updatedAt: Type.String({
    format: 'date-time',
    description: 'Fecha de última actualización',
  }),
})

export const CreatePostSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 2000,
    description: 'Contenido del post (máximo 2000 caracteres)',
  }),
  imageUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'URL de imagen opcional',
    })
  ),
})

export const UpdatePostSchema = Type.Object({
  content: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: 2000,
      description: 'Nuevo contenido del post',
    })
  ),
  imageUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: 'Nueva URL de imagen',
    })
  ),
})

export const PostParamsSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
    description: 'ID del post',
  }),
})

export const PostsFeedQuerySchema = Type.Intersect([
  PaginationQuerySchema,
  Type.Object({
    authorId: Type.Optional(
      Type.String({
        format: 'uuid',
        description: 'Filtrar posts por autor específico',
      })
    ),
    following: Type.Optional(
      Type.Boolean({
        description: 'Solo posts de usuarios seguidos (requiere autenticación)',
      })
    ),
  }),
])

export const PostsResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    posts: Type.Array(PostSchema, {
      description: 'Lista de posts',
    }),
    pagination: PaginationSchema,
  }),
})

export const PostResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    post: PostSchema,
  }),
})

export const LikeBookmarkResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    isLiked: Type.Optional(
      Type.Boolean({
        description: 'Estado actual del like',
      })
    ),
    isBookmarked: Type.Optional(
      Type.Boolean({
        description: 'Estado actual del bookmark',
      })
    ),
    likesCount: Type.Number({
      description: 'Número total de likes actualizado',
    }),
  }),
})

export const CommentSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  content: Type.String({ minLength: 1, maxLength: 1000 }),
  authorId: Type.String({ format: 'uuid' }),
  author: PostAuthorSchema,
  postId: Type.String({ format: 'uuid' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const CreateCommentSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 1000,
    description: 'Contenido del comentario (máximo 1000 caracteres)',
  }),
})

export type Post = Static<typeof PostSchema>
export type PostAuthor = Static<typeof PostAuthorSchema>
export type CreatePost = Static<typeof CreatePostSchema>
export type UpdatePost = Static<typeof UpdatePostSchema>
export type PostParams = Static<typeof PostParamsSchema>
export type PostsFeedQuery = Static<typeof PostsFeedQuerySchema>
export type PostsResponse = Static<typeof PostsResponseSchema>
export type PostResponse = Static<typeof PostResponseSchema>
export type LikeBookmarkResponse = Static<typeof LikeBookmarkResponseSchema>
export type Comment = Static<typeof CommentSchema>
export type CreateComment = Static<typeof CreateCommentSchema>
