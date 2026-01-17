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
import { useAuth, useForm } from '@/hooks'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { CreateUserRequest } from 'social-network-app-shared/types/auth.type'

interface ApiError {
  response?: {
    data?: { error?: string }
  }
}

interface RegisterFormValues extends CreateUserRequest {
  confirmPassword: string
}

const Register: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')

  const { values, handleChange, handleSubmit, isSubmitting, errors, touched } =
    useForm<RegisterFormValues>({
      initialValues: {
        email: '',
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        bio: '',
      },
      validate: vals => {
        const newErrors: Partial<Record<keyof RegisterFormValues, string>> = {}
        if (vals.password !== vals.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }
        if (vals.password.length > 0 && vals.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
        }
        if (vals.username.length > 0 && vals.username.length < 3) {
          newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
        }
        if (vals.username.length > 0 && !/^[a-zA-Z0-9_]+$/.test(vals.username)) {
          newErrors.username = 'Solo letras, números y guiones bajos'
        }
        return newErrors
      },
    })

  const onFormSubmit = async (data: RegisterFormValues) => {
    setError('')
    try {
      const userData = { ...data }

      delete (userData as Partial<RegisterFormValues>).confirmPassword

      await register(userData as CreateUserRequest)
      navigate('/')
    } catch (err: unknown) {
      const apiError = err as ApiError
      setError(apiError.response?.data?.error || 'Error al registrarse')
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
            borderRadius: 3,
          }}
        >
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            align='center'
            sx={{ fontWeight: 700 }}
          >
            Crear Cuenta
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit(onFormSubmit)}>
            <TextField
              fullWidth
              label='Nombre completo'
              value={values.name}
              onChange={handleChange('name')}
              margin='normal'
              required
              autoFocus
            />

            <TextField
              fullWidth
              label='Nombre de usuario'
              value={values.username}
              onChange={handleChange('username')}
              margin='normal'
              required
              error={!!errors.username && !!touched.username}
              helperText={
                touched.username && errors.username
                  ? errors.username
                  : 'Solo letras, números y guiones bajos (mínimo 3 caracteres)'
              }
            />

            <TextField
              fullWidth
              label='Email'
              type='email'
              value={values.email}
              onChange={handleChange('email')}
              margin='normal'
              required
            />

            <TextField
              fullWidth
              label='Biografía (opcional)'
              value={values.bio || ''}
              onChange={handleChange('bio')}
              margin='normal'
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label='Contraseña'
              type='password'
              value={values.password}
              onChange={handleChange('password')}
              margin='normal'
              required
              error={!!errors.password && !!touched.password}
              helperText={
                touched.password && errors.password
                  ? errors.password
                  : 'Mínimo 8 caracteres'
              }
            />

            <TextField
              fullWidth
              label='Confirmar contraseña'
              type='password'
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              margin='normal'
              required
              error={!!errors.confirmPassword && !!touched.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>

            <Box textAlign='center'>
              <Typography variant='body2' color='text.secondary'>
                ¿Ya tienes cuenta?{' '}
                <Link
                  component={RouterLink}
                  to='/login'
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register
