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
import type { CreateUserRequest } from 'aplica-shared/types/social'

const Register: React.FC = () => {
  const [userData, setUserData] = useState<CreateUserRequest>({
    email: '',
    username: '',
    name: '',
    password: '',
    bio: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (userData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    // Validate password strength
    if (userData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await register(userData)
      navigate('/') // Redirect to home after successful registration
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange =
    (field: keyof CreateUserRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserData(prev => ({
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
            Crear Cuenta
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Nombre completo'
              value={userData.name}
              onChange={handleChange('name')}
              margin='normal'
              required
              autoComplete='name'
              autoFocus
            />

            <TextField
              fullWidth
              label='Nombre de usuario'
              value={userData.username}
              onChange={handleChange('username')}
              margin='normal'
              required
              autoComplete='username'
              helperText='Sin espacios ni caracteres especiales'
            />

            <TextField
              fullWidth
              label='Email'
              type='email'
              value={userData.email}
              onChange={handleChange('email')}
              margin='normal'
              required
              autoComplete='email'
            />

            <TextField
              fullWidth
              label='Biografía (opcional)'
              value={userData.bio || ''}
              onChange={handleChange('bio')}
              margin='normal'
              multiline
              rows={2}
              helperText='Cuéntanos algo sobre ti'
            />

            <TextField
              fullWidth
              label='Contraseña'
              type='password'
              value={userData.password}
              onChange={handleChange('password')}
              margin='normal'
              required
              autoComplete='new-password'
              helperText='Mínimo 6 caracteres'
            />

            <TextField
              fullWidth
              label='Confirmar contraseña'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              margin='normal'
              required
              autoComplete='new-password'
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>

            <Box textAlign='center'>
              <Link component={RouterLink} to='/login' variant='body2'>
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register
