import React, { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { LoginRequest } from 'social-network-app-shared/types/social'

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(credentials)
      navigate('/')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos')
      } else if (err.response?.status === 429) {
        setError('Demasiados intentos. Intenta más tarde')
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange =
    (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({
        ...prev,
        [field]: e.target.value,
      }))
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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant='h4' component='h1' gutterBottom align='center'>
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Email'
              type='email'
              value={credentials.email}
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
              value={credentials.password}
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
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <Box textAlign='center'>
              <Link component={RouterLink} to='/register' variant='body2'>
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
