import { Type } from '@sinclair/typebox'
import { MAX_POST_CONTENT_LENGTH } from '../../domain'

export const PostAuthorSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  name: Type.String(),
  avatar: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  verified: Type.Boolean(),
})

export const PostSchema = Type.Object({
  id: Type.String(),
  content: Type.String(),
  image: Type.Optional(Type.String()),
  authorId: Type.String(),
  author: Type.Optional(PostAuthorSchema),
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  parent: Type.Optional(Type.Union([
    Type.Null(),
    Type.Object({
      id: Type.String(),
      content: Type.String(),
      author: Type.Pick(PostAuthorSchema, ['username', 'name', 'avatar']),
    }),
  ])),
  likesCount: Type.Number({ minimum: 0 }),
  repliesCount: Type.Number({ minimum: 0 }),
  bookmarksCount: Type.Number({ minimum: 0 }),
  isLiked: Type.Optional(Type.Boolean()),
  isBookmarked: Type.Optional(Type.Boolean()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  deletedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  tags: Type.Optional(Type.Array(Type.String())),
  replies: Type.Optional(Type.Array(Type.Any())),
})

export const PostParamsSchema = Type.Object({
  id: Type.String(),
})

export const CreatePostBodySchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: MAX_POST_CONTENT_LENGTH }),
  image: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
})

export const GetFeedQuerySchema = Type.Object({
  cursor: Type.Optional(Type.String()),
  since: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  authorId: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.String()),
  following: Type.Optional(Type.Boolean()),
})

export const PaginationQuerySchema = Type.Object({
  cursor: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
})

export const TagNameParamsSchema = Type.Object({
  tagName: Type.String(),
})

export const UpdatePostBodySchema = Type.Object({
  content: Type.Optional(Type.String({ minLength: 1, maxLength: MAX_POST_CONTENT_LENGTH })),
  image: Type.Optional(Type.String()),
})

export const ToggleLikeResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    isLiked: Type.Boolean(),
    likesCount: Type.Number(),
  }),
  message: Type.Optional(Type.String()),
})

export const ToggleBookmarkResponseSchema = Type.Object({
  success: Type.Literal(true),
  data: Type.Object({
    isBookmarked: Type.Boolean(),
  }),
  message: Type.Optional(Type.String()),
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
