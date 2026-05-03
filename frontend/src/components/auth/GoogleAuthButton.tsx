import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

interface GoogleAuthButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <GoogleLogin
        onSuccess={async credentialResponse => {
          if (credentialResponse.credential) {
            try {
              await loginWithGoogle(credentialResponse.credential)
              if (onSuccess) onSuccess()
              navigate('/')
            } catch (error: unknown) {
              const errorMessage =
                (error as { response?: { data?: { error?: string } } }).response
                  ?.data?.error || 'Error al autenticar con Google'
              if (onError) onError(errorMessage)
            }
          }
        }}
        onError={() => {
          console.error('Google Login Failed')
          if (onError) onError('Falló la autenticación con Google')
        }}
        useOneTap
        theme='outline'
        size='large'
        width='100%'
        shape='rectangular'
        text='continue_with'
      />
      <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
        Conexión segura vía Google SSL
      </Typography>
    </Box>
  )
}
