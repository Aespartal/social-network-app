import axiosInstance from './axiosInstance'
import type {
  Post,
  CreatePostRequest,
  PostRequest,
  PostResponse,
  PostDetailResponse,
} from '../../../shared/types/social.type'
import type { ApiResponse } from '../../../shared/types/api.type'
import { API_ENDPOINTS } from '@/constants'
import { RecentSearch } from '@/hooks/useRecentSearches'

export const postService = {
  async getFeed(params: PostRequest = {}): Promise<PostResponse> {
    // Limpiar parámetros null/undefined para que Axios no los envíe
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string | number>
    )

    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.FEED,
      { params: cleanParams }
    )
    return data.data!
  },

  async getFollowingFeed(params: PostRequest = {}): Promise<PostResponse> {
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string | number>
    )

    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.FOLLOWING,
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

    if (postData.country) {
      formData.append('country', postData.country)
    }

    if (postData.city) {
      formData.append('city', postData.city)
    }

    const { data } = await axiosInstance.post<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.CREATE,
      formData
    )

    return data.data!.post
  },

  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const { data } = await axiosInstance.post<
      ApiResponse<{ isLiked: boolean; likesCount: number }>
    >(API_ENDPOINTS.POSTS.LIKE(postId))
    return data.data!
  },

  async getUserPosts(
    username: string,
    params?: { cursor?: string | null; since?: string; limit?: number }
  ): Promise<PostResponse> {
    // Limpiar parámetros null/undefined
    const cleanParams = params
      ? Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = value
            }
            return acc
          },
          {} as Record<string, string | number>
        )
      : {}

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

  async getPostWithReplies(
    id: string,
    params: { cursor?: string | null; limit?: number } = {}
  ): Promise<PostDetailResponse> {
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string | number>
    )

    const { data } = await axiosInstance.get<ApiResponse<PostDetailResponse>>(
      API_ENDPOINTS.POSTS.BY_ID(id),
      { params: cleanParams }
    )
    return data.data!
  },

  async searchPosts(
    query: string,
    params: { cursor?: string | null; limit?: number } = {}
  ): Promise<PostResponse> {
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      { q: query } as Record<string, string | number>
    )

    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.SEARCH,
      { params: cleanParams }
    )
    return data.data!
  },

  async getRecentSearches(): Promise<RecentSearch[]> {
    const { data } = await axiosInstance.get<ApiResponse<RecentSearch[]>>(
      API_ENDPOINTS.POSTS.RECENT_SEARCH
    )
    return data.data!
  },

  async deleteRecentSearch(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.POSTS.DELETE_RECENT_SEARCH(id))
  },

  async clearRecentSearches(): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.POSTS.CLEAR_RECENT_SEARCH)
  },

  async getTrendingPosts(params: PostRequest = {}): Promise<PostResponse> {
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string | number>
    )

    const { data } = await axiosInstance.get<ApiResponse<PostResponse>>(
      API_ENDPOINTS.POSTS.TRENDING,
      { params: cleanParams }
    )
    return data.data!
  },
}
