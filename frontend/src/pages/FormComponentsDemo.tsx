import React, { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Alert,
  Badge,
  Modal,
} from '@/components/ui'
import { Container, Box, Typography, Grid, Divider } from '@mui/material'

export const FormComponentsDemo: React.FC = () => {
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    subscribe: false,
    gender: '',
    notifications: true,
  })

  const [showModal, setShowModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Options for select and radio
  const countryOptions = [
    { value: 'mx', label: 'México' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá' },
    { value: 'es', label: 'España' },
    { value: 'ar', label: 'Argentina' },
  ]

  const genderOptions = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
    { value: 'prefer-not-to-say', label: 'Prefiero no decir' },
  ]

  const handleSubmit = () => {
    // Simple validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.country) {
      newErrors.country = 'Por favor selecciona un país'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
      country: '',
      subscribe: false,
      gender: '',
      notifications: true,
    })
    setErrors({})
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant='h2'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Componentes de Formulario
        </Typography>
        <Typography variant='h6' color='text.secondary' sx={{ mb: 3 }}>
          Demostración completa de componentes Input, Modal y formularios
        </Typography>
        <Badge variant='success' size='md'>
          Componentes UI Abstraídos
        </Badge>
      </Box>

      {showAlert && (
        <Box sx={{ mb: 3 }}>
          <Alert variant='success' title='¡Formulario enviado!'>
            Los datos se han procesado correctamente.
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Formulario Principal */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader>
              <Typography variant='h5'>Formulario de Registro</Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Input básico */}
                <Input
                  label='Nombre completo'
                  placeholder='Ingresa tu nombre'
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={errors.name}
                  required
                />

                {/* Input con validación */}
                <Input
                  label='Correo electrónico'
                  placeholder='ejemplo@correo.com'
                  type='email'
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                  helperText='Usaremos este email para contactarte'
                  required
                />

                {/* Select */}
                <Select
                  label='País'
                  value={formData.country}
                  onChange={value =>
                    setFormData({ ...formData, country: value as string })
                  }
                  options={countryOptions}
                  placeholder='Selecciona tu país'
                  error={errors.country}
                  required
                />

                {/* Textarea */}
                <Textarea
                  label='Mensaje (opcional)'
                  placeholder='Cuéntanos más sobre ti...'
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  helperText='Máximo 500 caracteres'
                />

                <Divider />

                {/* RadioGroup */}
                <RadioGroup
                  label='Género'
                  value={formData.gender}
                  onChange={value =>
                    setFormData({ ...formData, gender: value as string })
                  }
                  options={genderOptions}
                  helperText='Esta información es opcional'
                />

                <Divider />

                {/* Checkbox */}
                <Checkbox
                  label='Quiero recibir noticias y promociones por email'
                  checked={formData.subscribe}
                  onChange={checked =>
                    setFormData({ ...formData, subscribe: checked })
                  }
                  helperText='Puedes cancelar la suscripción en cualquier momento'
                />

                {/* Switch */}
                <Switch
                  label='Activar notificaciones push'
                  checked={formData.notifications}
                  onChange={checked =>
                    setFormData({ ...formData, notifications: checked })
                  }
                  helperText='Recibe notificaciones instantáneas en tu dispositivo'
                />
              </Box>
            </CardContent>
            <CardFooter>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant='outline' onClick={handleReset}>
                  Limpiar
                </Button>
                <Button variant='primary' onClick={handleSubmit}>
                  Enviar Formulario
                </Button>
                <Button variant='ghost' onClick={() => setShowModal(true)}>
                  Vista Previa
                </Button>
              </Box>
            </CardFooter>
          </Card>
        </Grid>

        {/* Panel de Información */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader>
              <Typography variant='h6'>Datos del Formulario</Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Nombre:
                  </Typography>
                  <Typography variant='body1'>
                    {formData.name || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Email:
                  </Typography>
                  <Typography variant='body1'>
                    {formData.email || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    País:
                  </Typography>
                  <Typography variant='body1'>
                    {countryOptions.find(c => c.value === formData.country)
                      ?.label || 'No seleccionado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Género:
                  </Typography>
                  <Typography variant='body1'>
                    {genderOptions.find(g => g.value === formData.gender)
                      ?.label || 'No especificado'}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                      variant={formData.subscribe ? 'success' : 'secondary'}
                      size='sm'
                    >
                      {formData.subscribe ? 'Sí' : 'No'}
                    </Badge>
                    <Typography variant='body2'>Recibir emails</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                      variant={formData.notifications ? 'success' : 'secondary'}
                      size='sm'
                    >
                      {formData.notifications ? 'Sí' : 'No'}
                    </Badge>
                    <Typography variant='body2'>Notificaciones push</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Información sobre componentes */}
          <Card sx={{ mt: 2 }}>
            <CardHeader>
              <Typography variant='h6'>Componentes Utilizados</Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Badge variant='default' size='sm'>
                  Input
                </Badge>
                <Badge variant='default' size='sm'>
                  Textarea
                </Badge>
                <Badge variant='default' size='sm'>
                  Select
                </Badge>
                <Badge variant='default' size='sm'>
                  Checkbox
                </Badge>
                <Badge variant='default' size='sm'>
                  RadioGroup
                </Badge>
                <Badge variant='default' size='sm'>
                  Switch
                </Badge>
                <Badge variant='default' size='sm'>
                  Modal
                </Badge>
                <Badge variant='default' size='sm'>
                  Button
                </Badge>
                <Badge variant='default' size='sm'>
                  Card
                </Badge>
                <Badge variant='default' size='sm'>
                  Alert
                </Badge>
                <Badge variant='default' size='sm'>
                  Badge
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal de Vista Previa */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Vista Previa de Datos'
        size='md'
        actions={
          <Button variant='primary' onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        }
      >
        <Box sx={{ py: 2 }}>
          <Typography variant='body1' paragraph>
            Aquí puedes ver un resumen de los datos ingresados:
          </Typography>

          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
            <pre
              style={{
                fontSize: '0.875rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Box>

          <Alert variant='info'>
            Este modal demuestra cómo usar el componente Modal con acciones
            personalizadas.
          </Alert>
        </Box>
      </Modal>
    </Container>
  )
}
