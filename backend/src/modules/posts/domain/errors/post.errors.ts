export enum PostErrorCode {
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  POST_ALREADY_DELETED = 'POST_ALREADY_DELETED',
  POST_EMPTY_CONTENT = 'POST_EMPTY_CONTENT',
  POST_TOO_LONG = 'POST_TOO_LONG',
  POST_TOO_SHORT = 'POST_TOO_SHORT',
  POST_INVALID_PARENT = 'POST_INVALID_PARENT',
  POST_UNAUTHORIZED = 'POST_UNAUTHORIZED',
  POST_FORBIDDEN = 'POST_FORBIDDEN',
  POST_CREATION_FAILED = 'POST_CREATION_FAILED',
  POST_UPDATE_FAILED = 'POST_UPDATE_FAILED',
  POST_DELETE_FAILED = 'POST_DELETE_FAILED',
  GET_FEED_UNABLE = 'GET_FEED_UNABLE',
  INVALID_LIMIT = 'INVALID_LIMIT',
  GET_BOOKMARKED_POSTS_UNABLE = 'GET_BOOKMARKED_POSTS_UNABLE',
  GET_LIKED_POSTS_UNABLE = 'GET_LIKED_POSTS_UNABLE',
  GET_REPLIES_UNABLE = 'GET_REPLIES_UNABLE',
  TAG_EMPTY = 'TAG_EMPTY',
}

export class PostError extends Error {
  constructor(
    public readonly code: PostErrorCode,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'PostError'
    Object.setPrototypeOf(this, PostError.prototype)
  }

  static notFound(id: string): PostError {
    return new PostError(
      PostErrorCode.POST_NOT_FOUND,
      `Post con ID ${id} no encontrado`,
      404
    )
  }

  static alreadyDeleted(): PostError {
    return new PostError(
      PostErrorCode.POST_ALREADY_DELETED,
      'El post ya está eliminado',
      404
    )
  }

  static emptyContent(): PostError {
    return new PostError(
      PostErrorCode.POST_EMPTY_CONTENT,
      'El post debe tener al menos texto o una imagen',
      400
    )
  }

  static tooLong(maxLength: number): PostError {
    return new PostError(
      PostErrorCode.POST_TOO_LONG,
      `El contenido excede el máximo de ${maxLength} caracteres`,
      400
    )
  }

  static tooShort(minLength: number): PostError {
    return new PostError(
      PostErrorCode.POST_TOO_SHORT,
      `El contenido debe tener al menos ${minLength} caracteres`,
      400
    )
  }

  static invalidParent(parentId: string): PostError {
    return new PostError(
      PostErrorCode.POST_INVALID_PARENT,
      `El post padre con ID ${parentId} no existe`,
      400
    )
  }

  static unauthorized(): PostError {
    return new PostError(PostErrorCode.POST_UNAUTHORIZED, 'No autenticado', 401)
  }

  static forbidden(): PostError {
    return new PostError(
      PostErrorCode.POST_FORBIDDEN,
      'Sin permisos para realizar esta acción',
      403
    )
  }

  static creationFailed(): PostError {
    return new PostError(
      PostErrorCode.POST_CREATION_FAILED,
      'Error al crear el post',
      500
    )
  }

  static updateFailed(): PostError {
    return new PostError(
      PostErrorCode.POST_UPDATE_FAILED,
      'Error al actualizar el post',
      500
    )
  }

  static deleteFailed(): PostError {
    return new PostError(
      PostErrorCode.POST_DELETE_FAILED,
      'Error al eliminar el post',
      500
    )
  }

  static unableToFetchFeed(): PostError {
    return new PostError(
      PostErrorCode.GET_FEED_UNABLE,
      'Error al obtener el feed de posts',
      500
    )
  }

  static unableToFetchBookmarkedPosts(): PostError {
    return new PostError(
      PostErrorCode.GET_BOOKMARKED_POSTS_UNABLE,
      'Error al obtener los posts guardados',
      500
    )
  }

  static invalidLimit(): PostError {
    return new PostError(
      PostErrorCode.INVALID_LIMIT,
      'El límite debe estar entre 1 y 100',
      400
    )
  }

  static unableToFetchLikedPosts(): PostError {
    return new PostError(
      PostErrorCode.GET_LIKED_POSTS_UNABLE,
      'Error al obtener los posts que te gustaron',
      500
    )
  }

  static unableToFetchReplies(): PostError {
    return new PostError(
      PostErrorCode.GET_REPLIES_UNABLE,
      'Error al obtener las respuestas del post',
      500
    )
  }

  static tagEmpty(): PostError {
    return new PostError(
      PostErrorCode.TAG_EMPTY,
      'El nombre de la etiqueta no puede estar vacío',
      400
    )
  }

  static unableToFetchPost(): PostError {
    return new PostError(
      PostErrorCode.POST_NOT_FOUND,
      'Error al obtener el post',
      500
    )
  }
}

export function isPostError(error: unknown): error is PostError {
  return error instanceof PostError
}

export const POST_ERROR_HTTP_MAPPING: Record<PostErrorCode, number> = {
  [PostErrorCode.POST_NOT_FOUND]: 404,
  [PostErrorCode.POST_ALREADY_DELETED]: 404,
  [PostErrorCode.POST_EMPTY_CONTENT]: 400,
  [PostErrorCode.POST_TOO_LONG]: 400,
  [PostErrorCode.POST_INVALID_PARENT]: 400,
  [PostErrorCode.POST_UNAUTHORIZED]: 401,
  [PostErrorCode.POST_FORBIDDEN]: 403,
  [PostErrorCode.POST_CREATION_FAILED]: 500,
  [PostErrorCode.POST_UPDATE_FAILED]: 500,
  [PostErrorCode.POST_DELETE_FAILED]: 500,
  [PostErrorCode.GET_FEED_UNABLE]: 500,
  [PostErrorCode.INVALID_LIMIT]: 400,
  [PostErrorCode.GET_BOOKMARKED_POSTS_UNABLE]: 500,
  [PostErrorCode.GET_LIKED_POSTS_UNABLE]: 500,
  [PostErrorCode.GET_REPLIES_UNABLE]: 500,
  [PostErrorCode.TAG_EMPTY]: 400,
  [PostErrorCode.POST_TOO_SHORT]: 400,
}
