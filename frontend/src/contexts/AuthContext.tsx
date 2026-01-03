import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import { profileService } from '@/services/profile.service'
import type {
  User,
  LoginRequest,
  CreateUserRequest,
} from 'social-network-app-shared/types/auth.type'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: CreateUserRequest) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const saveAuthData = (
    token: string,
    userData: User,
    refreshToken?: string
  ) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
    setUser(userData)
  }

  const clearAuthData = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const savedUser = localStorage.getItem('user_data')

      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      try {
        setUser(JSON.parse(savedUser))
        const userData = await profileService.getProfile()
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
      } catch (error) {
        console.error('Error al verificar la autenticación:', error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) setUser(null)
    }

    globalThis.addEventListener('storage', handleStorageChange)
    return () => globalThis.removeEventListener('storage', handleStorageChange)
  }, [])

  // SOLUCIÓN AL ERROR no-useless-catch:
  // Si solo vas a hacer "throw error", no necesitas el try/catch.
  const login = async (credentials: LoginRequest) => {
    const {
      token,
      user: userData,
      refreshToken,
    } = await authService.login(credentials)
    saveAuthData(token, userData, refreshToken)
  }

  const register = async (userData: CreateUserRequest) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      saveAuthData(response.token, response.user, response.refreshToken)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) await authService.logout(refreshToken)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      clearAuthData()
    }
  }

  const loginWithGoogle = async (idToken: string) => {
    const response = await authService.loginWithGoogle(idToken)
    saveAuthData(response.token, response.user, response.refreshToken)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
