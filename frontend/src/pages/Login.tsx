import React, { useState } from 'react'
import {
  Container,
  Paper,
  Input as TextField,
  Button,
  Text as Typography,
  Box,
  Alert,
} from '@/components/ui'
import { Link, Divider } from '@mui/material'
import { useAuth, useForm } from '@/hooks'
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { LoginRequest } from 'social-network-app-shared/types/auth.type'

interface ApiError {
  response?: {
    status?: number
    data?: { message?: string }
  }
}

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [error, setError] = useState<string>('')

  const sessionMessage =
    searchParams.get('expired') === 'true'
      ? 'Tu sesión ha expirado por seguridad. Por favor, inicia sesión de nuevo.'
      : null

  const { values, handleChange, handleSubmit, isSubmitting } =
    useForm<LoginRequest>({
      initialValues: {
        email: '',
        password: '',
      },
    })

  const onFormSubmit = async (data: LoginRequest) => {
    setError('')

    try {
      await login(data)
      navigate('/')
    } catch (err: unknown) {
      const apiError = err as ApiError
      const status = apiError.response?.status

      if (status === 401) {
        setError('Email o contraseña incorrectos')
      } else if (status === 429) {
        setError('Demasiados intentos. Intenta más tarde')
      } else {
        setError(apiError.response?.data?.message || 'Error al iniciar sesión')
      }
    }
  }

  return (
    <Container maxWidth='sm'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
        py={4}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
          }}
        >
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            align='center'
            sx={{ fontWeight: 700 }}
          >
            Iniciar Sesión
          </Typography>

          {sessionMessage && (
            <Alert severity='info' sx={{ mb: 2, borderRadius: 2 }}>
              {sessionMessage}
            </Alert>
          )}

          {error && (
            <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit(onFormSubmit)}>
            <TextField
              fullWidth
              label='Email'
              type='email'
              value={values.email}
              onChange={handleChange('email')}
              margin='normal'
              required
              autoComplete='email'
              autoFocus
            />

            <TextField
              fullWidth
              label='Contraseña'
              type='password'
              value={values.password}
              onChange={handleChange('password')}
              margin='normal'
              required
              autoComplete='current-password'
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant='body2' color='text.secondary'>
                o
              </Typography>
            </Divider>

            <Box display='flex' justifyContent='center' mb={3}>
              <GoogleAuthButton onError={msg => setError(msg)} />
            </Box>

            <Box textAlign='center'>
              <Typography variant='body2' color='text.secondary'>
                ¿No tienes cuenta?{' '}
                <Link
                  component={RouterLink}
                  to='/register'
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
