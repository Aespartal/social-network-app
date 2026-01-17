import axiosInstance from './axiosInstance'
import type {
  Post,
  CreatePostRequest,
  PostRequest,
  PostResponse,
} from '../../../shared/types/social.type'
import type { ApiResponse } from '../../../shared/types/api.type'
import { API_ENDPOINTS } from '@/constants'

export const postService = {
  async getFeed(params: PostRequest = {}): Promise<PostResponse> {
    // Limpiar parámetros null/undefined para que Axios no los envíe
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)
    
    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.FEED,
      { params: cleanParams }
    )
    return data.data!
  },

  async createPost(
    postData: CreatePostRequest & { imageFile?: File }
  ): Promise<Post> {
    const formData = new FormData()

    formData.append('content', postData.content)

    if (postData.parentId) {
      formData.append('parentId', postData.parentId)
    }

    if (postData.tags) {
      formData.append('tags', JSON.stringify(postData.tags))
    }

    if (postData.imageFile) {
      formData.append('image', postData.imageFile)
    }

    const { data } = await axiosInstance.post<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.CREATE,
      formData
    )

    return data.data!.post
  },

  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    const { data } = await axiosInstance.post<
      ApiResponse<{ isLiked: boolean; likeCount: number }>
    >(API_ENDPOINTS.POSTS.LIKE(postId))
    return data.data!
  },

  async getUserPosts(
    username: string,
    params?: { cursor?: string | null; since?: string; limit?: number }
  ): Promise<PostResponse> {
    // Limpiar parámetros null/undefined
    const cleanParams = params ? Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>) : {}
    
    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.BY_USER(username),
      { params: cleanParams }
    )
    return data.data!
  },

  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    const { data } = await axiosInstance.post<
      ApiResponse<{ isBookmarked: boolean }>
    >(API_ENDPOINTS.POSTS.BOOKMARK(postId))
    return data.data!
  },

  async getPostWithReplies(id: string): Promise<Post> {
    const response = await axiosInstance.get<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.BY_ID(id)
    )
    return response.data.data!.post
  },
}
