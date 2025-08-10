export interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: string | null
  bio?: string | null
  verified: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  username: string
  name: string
  password: string
  avatar?: string
  bio?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface Post {
  id: string
  content: string
  image?: string | null
  authorId: string
  createdAt: string
  updatedAt: string
  author: User
  likes: Like[]
  comments: Comment[]
  bookmarks: Bookmark[]
  tags: PostTag[]
  _count?: {
    likes: number
    comments: number
    bookmarks: number
  }
}

export interface CreatePostRequest {
  content: string
  image?: string
  tags?: string[]
}

export interface UpdatePostRequest {
  content?: string
  image?: string
  tags?: string[]
}

export interface Like {
  id: string
  userId: string
  postId: string
  createdAt: string
  user?: User
}

export interface Comment {
  id: string
  content: string
  userId: string
  postId: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateCommentRequest {
  content: string
  postId: string
}

export interface Bookmark {
  id: string
  userId: string
  postId: string
  createdAt: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
  follower?: User
  following?: User
}

export interface Tag {
  id: string
  name: string
  createdAt: string
}

export interface PostTag {
  id: string
  postId: string
  tagId: string
  tag?: Tag
}

export interface FeedResponse {
  posts: Post[]
  hasMore: boolean
  nextCursor?: string
}

export interface FeedRequest {
  cursor?: string
  limit?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  status: number
  message: string
  details?: any
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}
