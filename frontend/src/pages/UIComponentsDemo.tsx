import React, { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Alert,
  Badge,
  Loading,
  Modal,
  Input,
} from '@/components/ui'
import { Container, Box, Typography, Grid, Divider } from '@mui/material'

export const UIComponentsDemo: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await apiService.get('/api/test')
        setMessage(response.data.message)
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveName = () => {
    console.log('Nombre guardado:', name)
    setShowModal(false)
    setName('')
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant='h2'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          Demostración de Componentes UI
        </Typography>
        <Typography variant='h6' color='text.secondary' sx={{ mb: 3 }}>
          Componentes abstraídos usando Material-UI internamente
        </Typography>
        <Badge variant='success' size='md'>
          Versión 2.0.0 - Abstracción UI
        </Badge>
      </Box>

      <Grid container spacing={3}>
        {/* API Status Card */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader>
              <Typography variant='h5' component='h2'>
                Estado de la API
              </Typography>
            </CardHeader>
            <CardContent>
              {loading && <Loading text='Conectando con el servidor...' />}

              {error && (
                <Alert variant='error' title='Error de conexión'>
                  {error}
                </Alert>
              )}

              {message && (
                <Alert variant='success' title='Conexión exitosa'>
                  {message}
                </Alert>
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Badge variant='default' size='md'>
                  Frontend: http://localhost:3001
                </Badge>
                <Badge variant='secondary' size='md'>
                  Backend: http://localhost:3001
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Components Demo */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader>
              <Typography variant='h5' component='h2'>
                Demostración de Componentes Abstraídos
              </Typography>
            </CardHeader>
            <CardContent>
              {/* Buttons */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Botones (Button)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant='primary'>Primario</Button>
                  <Button variant='secondary'>Secundario</Button>
                  <Button variant='outline'>Outline</Button>
                  <Button variant='ghost'>Ghost</Button>
                  <Button variant='destructive'>Destructivo</Button>
                  <Button loading>Cargando...</Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Badges */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Badges (Chip internamente)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Badge variant='default'>Por defecto</Badge>
                  <Badge variant='secondary'>Secundario</Badge>
                  <Badge variant='success'>Éxito</Badge>
                  <Badge variant='warning'>Advertencia</Badge>
                  <Badge variant='error'>Error</Badge>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Alert Demo */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Alertas (Alert)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert variant='info' title='Información'>
                    Este es un mensaje informativo usando nuestro componente
                    Alert.
                  </Alert>
                  <Alert variant='success'>
                    Operación completada exitosamente.
                  </Alert>
                  <Alert variant='warning' title='Advertencia'>
                    Ten cuidado con esta acción.
                  </Alert>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Loading Demo */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Loading (CircularProgress internamente)
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Loading size='sm' text='Pequeño' />
                  <Loading size='md' text='Mediano' />
                  <Loading size='lg' text='Grande' />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Input Demo */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Input (TextField internamente)
                </Typography>
                <Box sx={{ maxWidth: 400 }}>
                  <Input
                    label='Nombre'
                    placeholder='Ingresa tu nombre'
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    helperText='Este campo usa nuestro componente Input abstrado'
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Modal Demo */}
              <Box>
                <Typography variant='h6' gutterBottom>
                  Modal (Dialog internamente)
                </Typography>
                <Button variant='outline' onClick={() => setShowModal(true)}>
                  Abrir Modal
                </Button>
              </Box>
            </CardContent>
            <CardFooter>
              <Typography variant='body2' color='text.secondary'>
                Todos estos componentes están abstraídos y usan Material-UI
                internamente
              </Typography>
            </CardFooter>
          </Card>
        </Grid>
      </Grid>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Ejemplo de Modal Abstraído'
        size='md'
      >
        <Box sx={{ py: 2 }}>
          <Typography paragraph>
            Este modal usa nuestro componente Modal que internamente usa
            Material-UI Dialog.
          </Typography>
          <Input
            label='Tu nombre'
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder='Ingresa tu nombre'
          />
          <Box
            sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}
          >
            <Button variant='outline' onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant='primary' onClick={handleSaveName}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}
