import axiosInstance from './axiosInstance'
import type {
  LoginRequest,
  CreateUserRequest,
  AuthResponse,
} from '../../../shared/types/auth.type'
import type { ApiResponse } from '../../../shared/types/api.type'
import { API_ENDPOINTS } from '@/constants'

/**
 * Servicio encargado de la gestión de autenticación y sesiones de usuario.
 */
export const authService = {
  // --- AUTENTICACIÓN ---

  /**
   * Inicia sesión con credenciales tradicionales (email y contraseña).
   * @param credentials - Objeto con email y password.
   * @returns Promesa con los datos del usuario, token de acceso y refresh token.
   * @throws Error de Axios si las credenciales son inválidas.
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return data.data!
  },

  /**
   * Registra un nuevo usuario en la plataforma e inicia sesión automáticamente.
   * @param userData - Datos completos del nuevo usuario (email, username, name, password, etc).
   * @returns Promesa con la información del usuario creado y sus tokens de acceso.
   */
  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )
    return data.data!
  },

  /**
   * Autentica al usuario utilizando un token de identidad de Google.
   * @param idToken - El 'id_token' obtenido tras la autenticación exitosa con Google SDK.
   * @returns Promesa con los datos del usuario (vinculado o creado) y tokens de sesión.
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
      {
        token: idToken,
      }
    )
    return data.data!
  },

  /**
   * Cierra la sesión del usuario actual invalidando el refresh token en el servidor.
   * @param refreshToken - Token de refresco que se desea revocar.
   */
  async logout(refreshToken: string): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
  },
}
