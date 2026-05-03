import { useNavigate } from 'react-router-dom'
import { Box, Text as Typography, Button, Container } from '@/components/ui'
import { alpha, useTheme } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'

export const NotFound = () => {
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
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '8rem', md: '12rem' },
              fontWeight: 900,
              lineHeight: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.4)})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.2,
              userSelect: 'none',
            }}
          >
            404
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
            }}
          >
            <Typography variant='h2' weight='extrabold' mb={1}>
              Parece que te has perdido
            </Typography>
            <Typography variant='body1' color='text.secondary' size='lg'>
              La página que buscas no existe o ha sido movida a otra dimensión.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
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
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Volver al inicio
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
            }}
          >
            Regresar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFound
