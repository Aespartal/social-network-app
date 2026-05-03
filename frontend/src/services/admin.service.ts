import axiosInstance from './axiosInstance'
import type { ApiResponse } from 'social-network-app-shared/types/api.type'
import type { User, Role } from 'social-network-app-shared/types/auth.type'

export interface AdminStats {
  totalUsers: number
  totalPosts: number
  activeUsers: number
  reportsPending: number
  dailyGrowth: {
    createdAt: string
    _count: number
  }[]
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response =
      await axiosInstance.get<ApiResponse<AdminStats>>('/admin/stats')
    return response.data.data!
  },

  getUsers: async (
    page = 1,
    limit = 10
  ): Promise<{ data: User[]; meta: unknown }> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      `/admin/users?page=${page}&limit=${limit}`
    )
    return {
      data: response.data.data!,
      meta: (response.data as unknown as { meta: unknown }).meta,
    }
  },

  updateUserRole: async (userId: string, role: Role): Promise<User> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/admin/users/${userId}/role`,
      { role }
    )
    return response.data.data!
  },

  toggleUserActive: async (
    userId: string
  ): Promise<{ id: string; active: boolean }> => {
    const response = await axiosInstance.post<
      ApiResponse<{ id: string; active: boolean }>
    >(`/admin/users/${userId}/toggle-active`)
    return response.data.data!
  },
}
