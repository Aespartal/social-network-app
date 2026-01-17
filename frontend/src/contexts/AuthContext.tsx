import { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { authService, profileService } from '@/services'
import { backupSession, restoreSession, clearSessionBackup } from '@/utils/sessionGuard'
import type {
  User,
  LoginRequest,
  CreateUserRequest,
  AuthResponse,
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

  const saveAuthData = useCallback((authData: AuthResponse) => {
    const { tokens, user: userData } = authData

    localStorage.setItem('access_token', tokens.accessToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)
    localStorage.setItem('user_data', JSON.stringify(userData))

    setUser(userData)
    
    backupSession()
  }, [])

  const clearAuthData = useCallback(() => {
    clearSessionBackup()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }, [])

  useEffect(() => {
      const wasRestored = restoreSession()
      if (wasRestored) {
        console.log('🔄 Session recovered from backup')
      }

      const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const savedUser = localStorage.getItem('user_data')

      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)

        backupSession()
        const userData = await profileService.getProfile()
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
      } catch (error) {
        console.error('❌ Error al verificar la autenticación:', error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        setUser(null)
      }
      
      if (e.key === 'user_data' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue)
          setUser(newUser)
        } catch (error) {
          console.error('Error parsing user from storage event:', error)
        }
      }
    }

    globalThis.addEventListener('storage', handleStorageChange)
    return () => globalThis.removeEventListener('storage', handleStorageChange)
  }, [clearAuthData])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)
      saveAuthData(response)
    } finally {
      setLoading(false)
    }
  }, [saveAuthData])

  const register = useCallback(async (userData: CreateUserRequest) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      saveAuthData(response)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [saveAuthData])

  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      setLoading(true)
      const response = await authService.loginWithGoogle(idToken)
      saveAuthData(response)
    } finally {
      setLoading(false)
    }
  }, [saveAuthData])

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error)
    } finally {
      clearAuthData()
    }
  }, [clearAuthData])

  const authContextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, loginWithGoogle, logout]
  )

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
