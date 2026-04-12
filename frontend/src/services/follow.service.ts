import axiosInstance from './axiosInstance'
import { ApiResponse } from 'social-network-app-shared/types/api.type'

export interface Follower {
  id: string
  username: string
  name: string
  avatar: string | null
  verified: boolean
  isFollowing: boolean
}

export const followService = {
  async follow(userId: string): Promise<void> {
    await axiosInstance.post(`/users/${userId}/follow`)
  },

  async unfollow(userId: string): Promise<void> {
    await axiosInstance.post(`/users/${userId}/unfollow`)
  },

  async getFollowers(userId: string): Promise<Follower[]> {
    const { data } = await axiosInstance.get<ApiResponse<Follower[]>>(
      `/users/${userId}/followers`
    )
    return data.data || []
  },

  async getFollowing(userId: string): Promise<Follower[]> {
    const { data } = await axiosInstance.get<ApiResponse<Follower[]>>(
      `/users/${userId}/following`
    )
    return data.data || []
  },

  async isFollowing(userId: string): Promise<boolean> {
    const { data } = await axiosInstance.get<ApiResponse<boolean>>(
      `/users/${userId}/is-following`
    )
    return data.data ?? false
  },
}
