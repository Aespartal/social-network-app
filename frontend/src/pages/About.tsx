import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Container,
  Chip,
  Divider,
  Grid,
} from '@mui/material'
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

export const About: React.FC = () => {
  const frontendTech = [
    'React 18 con TypeScript',
    'Vite para desarrollo rápido',
    'React Router para navegación',
    'CSS personalizado para estilos',
    'Axios para llamadas a la API',
  ]

  const backendTech = [
    'Fastify con TypeScript',
    'CORS configurado',
    'Helmet para seguridad',
    'Rate limiting',
    'Estructura modular',
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Card
        variant='outlined'
        sx={{
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant='h3'
            component='h2'
            fontWeight='bold'
            color='text.primary'
            mb={3}
          >
            Acerca de SocialNetworkApp
          </Typography>

          <Typography variant='body1' color='text.secondary' mb={4}>
            SocialNetworkApp es una aplicación full-stack moderna construida con
            las últimas tecnologías:
          </Typography>

          <Grid container spacing={3} mb={4}>
            {/* Frontend Card */}
            <Grid size={6}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent>
                  <Box display='flex' alignItems='center' mb={2}>
                    <CodeIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography
                      variant='h5'
                      component='h3'
                      fontWeight='semibold'
                      color='primary.main'
                    >
                      Frontend
                    </Typography>
                  </Box>

                  <List dense>
                    {frontendTech.map((tech, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon
                            fontSize='small'
                            sx={{ color: 'primary.main' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={tech}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Backend Card */}
            <Grid size={6}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent>
                  <Box display='flex' alignItems='center' mb={2}>
                    <StorageIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography
                      variant='h5'
                      component='h3'
                      fontWeight='semibold'
                      color='success.main'
                    >
                      Backend
                    </Typography>
                  </Box>

                  <List dense>
                    {backendTech.map((tech, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon
                            fontSize='small'
                            sx={{ color: 'success.main' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={tech}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Alert/Note Section */}
          <Alert
            severity='warning'
            icon={<WarningIcon />}
            sx={{
              backgroundColor: 'warning.light',
              '& .MuiAlert-icon': {
                color: 'warning.main',
              },
            }}
          >
            <Typography variant='body2'>
              <strong>Nota:</strong> Esta es una plantilla base. Puedes
              extenderla agregando base de datos, autenticación, más rutas,
              componentes y funcionalidades según tus necesidades.
            </Typography>
          </Alert>

          {/* Optional: Technology Chips */}
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant='h6' component='h4' mb={2}>
              Tecnologías Principales
            </Typography>
            <Box display='flex' flexWrap='wrap' gap={1}>
              <Chip label='React' color='primary' variant='outlined' />
              <Chip label='TypeScript' color='primary' variant='outlined' />
              <Chip label='Fastify' color='success' variant='outlined' />
              <Chip label='Vite' color='secondary' variant='outlined' />
              <Chip label='Material-UI' color='info' variant='outlined' />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
