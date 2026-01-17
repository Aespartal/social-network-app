import { ApiResponse } from 'social-network-app-shared/types/api.type'

import axiosInstance from './axiosInstance'
import { User } from 'social-network-app-shared/types/auth.type'
import { API_ENDPOINTS } from '@/constants'

/**
 * Servicio encargado de las operaciones relacionadas con los perfiles de usuario.
 */
export const profileService = {
  /**
   * Registra una visita de forma silenciosa.
   */
  async recordVisit(visitedId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>(API_ENDPOINTS.PROFILE.VISIT(visitedId))
  },

  /**
   * Obtiene la lista de usuarios que han visitado mi perfil.
   */
  async getProfileVisits(): Promise<User[]> {
    const { data } =
      await axiosInstance.get<ApiResponse<User[]>>(API_ENDPOINTS.PROFILE.MY_VISITS)
    return data.data ?? []
  },

  /**
   * Obtiene la información detallada del usuario actualmente autenticado basado en el token de la sesión.
   * @returns Promesa con el objeto User y sus metadatos (posts count, followers, etc).
   * @throws Error si el token ha expirado o no se encuentra el usuario.
   */
  async getProfile(): Promise<User> {
    const { data } =
      await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.PROFILE.ME)

    if (!data.data) {
      throw new Error(
        'La respuesta del servidor no contiene los datos del usuario.'
      )
    }

    return data.data
  },

  async getByUsername(username: string): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.PROFILE.BY_USERNAME(username)
    )
    return data.data!
  },

  async getSuggestions(limit?: number): Promise<User[]> {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>(
      API_ENDPOINTS.PROFILE.SUGGESTIONS,
      {
        params: { limit },
      }
    )
    return data.data ?? []
  },

  /**
   * Actualiza el perfil del usuario.
   * @param userId ID del usuario a actualizar
   * @param formData FormData con los datos a actualizar (username, name, bio, avatar)
   * @returns Promesa con el usuario actualizado
   */
  async updateProfile(userId: string, formData: FormData): Promise<User> {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(
      API_ENDPOINTS.PROFILE.UPDATE(userId),
      formData
    )
    
    if (!data.data) {
      throw new Error('Error al actualizar el perfil')
    }
    
    return data.data
  },
}
