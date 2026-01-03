import { User } from "./auth.type";

export interface Post {
  id: string;
  content: string;
  image?: string | null; 
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  
  parentId?: string | null;
  parent?: Post | null;
  replies?: Post[];

  likesCount: number;
  repliesCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: PostTag[];
  
  _count?: {
    likes: number;
    replies: number;
    bookmarks: number;
  };
}

export interface CreatePostRequest {
  content: string;
  image?: string;
  tags?: string[];
  parentId?: string;
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
  page?: number
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}
