import axiosInstance from './axiosInstance'
import { ApiResponse } from 'social-network-app-shared/types/api.type'

export interface AuraNode {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  color?: string
  vibration: number
  pulse: number
  category?: string
  isTuned?: boolean
}

export const nodeService = {
  getTrending: async (limit = 5): Promise<ApiResponse<AuraNode[]>> => {
    const response = await axiosInstance.get(`/nodes/trending?limit=${limit}`)
    return response.data
  },

  getBySlug: async (slug: string): Promise<ApiResponse<AuraNode>> => {
    const response = await axiosInstance.get(`/nodes/${slug}`)
    return response.data
  },

  tune: async (slug: string): Promise<ApiResponse<{ isTuned: boolean }>> => {
    const response = await axiosInstance.post(`/nodes/${slug}/tune`)
    return response.data
  },
}
