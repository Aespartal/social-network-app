
import { ApiResponse } from 'social-network-app-shared/types/api.type';

import axiosInstance from './axiosInstance';
import { User } from 'social-network-app-shared/types/auth.type';

/**
 * Servicio encargado de las operaciones relacionadas con los perfiles de usuario.
 */
export const profileService = {
  /**
   * Registra una visita de forma silenciosa.
   */
  async recordVisit(visitedId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>(`/profile/visit/${visitedId}`);
  },

  /**
   * Obtiene la lista de usuarios que han visitado mi perfil.
   */
  async getProfileVisits(): Promise<User[]> {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>('/profile/my-visits');
    return data.data ?? [];
  },

  /**
   * Obtiene la información detallada del usuario actualmente autenticado basado en el token de la sesión.
   * @returns Promesa con el objeto User y sus metadatos (posts count, followers, etc).
   * @throws Error si el token ha expirado o no se encuentra el usuario.
   */
  async getProfile(): Promise<User> {
    const { data } =
      await axiosInstance.get<ApiResponse<{ user: User }>>('/profile')

    if (!data.data?.user) {
      throw new Error(
        'La respuesta del servidor no contiene los datos del usuario.'
      )
    }

    return data.data.user
  },

  async getByUsername(username: string): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<User>>(`/profile/${username}`);
    return data.data !;
  },

  async getSuggestions(limit?: number): Promise<User[]> {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>('/profile/suggestions', {
      params: { limit }
    });
    return data.data ?? [];
  },
};