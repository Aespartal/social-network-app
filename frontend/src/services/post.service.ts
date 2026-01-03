import axiosInstance from './axiosInstance'
import type {
  Post,
  CreatePostRequest,
  FeedRequest,
  FeedResponse,
} from '../../../shared/types/social.type'
import type { ApiResponse } from '../../../shared/types/api.type'

export const postService = {
  async getFeed(params: FeedRequest = {}): Promise<FeedResponse> {
    const { data } = await axiosInstance.get<ApiResponse<FeedResponse>>(
      '/posts/feed',
      { params }
    )
    return data.data!
  },

  async createPost(postData: CreatePostRequest): Promise<Post> {
    const { data } = await axiosInstance.post<ApiResponse<Post>>(
      '/posts',
      postData
    )
    return data.data!
  },

  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    const { data } = await axiosInstance.post<
      ApiResponse<{ isLiked: boolean; likeCount: number }>
    >(`/posts/${postId}/like`)
    return data.data!
  },

  async getUserPosts(
    username: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Post[]> {
    const { data } = await axiosInstance.get<ApiResponse<{ posts: Post[] }>>(
      `/posts/user/${username}?page=${page}&limit=${limit}`
    )
    return data.data?.posts || []
  },

  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    const { data } = await axiosInstance.post<
      ApiResponse<{ isBookmarked: boolean }>
    >(`/posts/${postId}/bookmark`)
    return data.data!
  },

  async getPostWithReplies(id: string): Promise<Post> {
  const response = await axiosInstance.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
  return response.data.data!.post; 
}
}
