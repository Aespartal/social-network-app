import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Button, CircularProgress, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Definimos una interfaz para el error de la API si usas Axios
interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
}

interface GoogleAuthButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsLoading(true)
      try {
        await loginWithGoogle(tokenResponse.access_token)
        if (onSuccess) onSuccess()
        navigate('/')
      } catch (error: unknown) {
        const err = error as ApiError
        const errorMessage =
          err.response?.data?.error || 'Error al autenticar con Google'

        if (onError) onError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    onError: error => {
      console.error('Google Login Failed:', error)
      if (onError) onError('Falló la autenticación con Google')
    },
  })

  return (
    <Button
      fullWidth
      variant='outlined'
      size='large'
      onClick={() => login()}
      disabled={isLoading}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} color='inherit' />
        ) : (
          /* SVG de Google */
          <Box
            component='svg'
            sx={{ width: 20, height: 20 }}
            viewBox='0 0 24 24'
          >
            <path
              fill='#4285F4'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='#34A853'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='#FBBC05'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z'
            />
            <path
              fill='#EA4335'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </Box>
        )
      }
      sx={{
        py: 1.5,
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
        borderColor: 'divider',
        color: 'text.primary',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
      }}
    >
      {isLoading ? 'Autenticando...' : 'Acceder con Google'}
    </Button>
  )
}
