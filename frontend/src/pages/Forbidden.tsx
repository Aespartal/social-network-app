import { useNavigate } from 'react-router-dom'
import { Box, Text as Typography, Button, Container } from '@/components/ui'
import { alpha, useTheme } from '@mui/material'
import { Security as SecurityIcon, Home as HomeIcon } from '@mui/icons-material'

export const Forbidden = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            mb: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '140%',
              height: '140%',
              borderRadius: '50%',
              border: `1px dashed ${alpha(theme.palette.error.main, 0.2)}`,
              animation: 'spin 20s linear infinite',
            },
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
          }}
        >
          <SecurityIcon sx={{ fontSize: 60 }} />
        </Box>

        <Box>
          <Typography variant='h2' weight='extrabold' mb={2} color='error'>
            Acceso Restringido
          </Typography>
          <Typography variant='body1' color='text.secondary' size='lg' mb={4}>
            Lo sentimos, pero no tienes los permisos necesarios para acceder a
            esta sección. Si crees que esto es un error, por favor contacta con
            soporte.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant='contained'
            size='large'
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: '99px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              bgcolor: theme.palette.error.main,
              '&:hover': {
                bgcolor: theme.palette.error.dark,
              },
              boxShadow: `0 8px 20px ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            Ir al inicio
          </Button>
          <Button
            variant='outlined'
            size='large'
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '99px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.dark,
                bgcolor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            Regresar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Forbidden
