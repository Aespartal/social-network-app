import { User } from "./auth.type";

export interface Post {
  id: string;
  content: string;
  image?: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  author: User;

  parentId?: string | null;
  parent?: Post | null;
  replies?: Post[];

  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: PostTag[];
  likesCount: number;
  repliesCount: number;
  bookmarksCount: number;
}

export interface CreatePostRequest {
  content: string;
  imageFile?: File;
  tags?: string[];
  parentId?: string;
}

export interface UpdatePostRequest {
  content?: string;
  image?: string;
  tags?: string[];
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user?: User;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface PostTag {
  id: string;
  postId: string;
  tagId: string;
  tag?: Tag;
}

export interface PostResponse {
  posts: Post[];
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
    total?: number;
  };
}

export interface PostRequest {
  cursor?: string | null;
  since?: string;  // ID del post más reciente para traer solo posts más nuevos
  limit?: number;
  page?: number;
  following?: boolean;
  authorId?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}
