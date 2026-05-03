import React from 'react'
import { Box, Text as Typography, Stack } from '@/components/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { SearchBar } from '../home/SearchBar'
import { NodeList } from '../home/NodeList'
import { SuggestedUsers } from '../profile/SuggestedUsers'
import { useAuth } from '@/hooks'
import { Button, alpha, useTheme } from '@mui/material'

/**
 * Componente unificado para la columna lateral derecha (Descubrimiento y Contexto)
 */
export const AuraSidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const { isAuthenticated } = useAuth()

  // En Aura, siempre queremos el buscador en el sidebar lateral
  // a menos que estemos en una vista móvil muy específica (handled via CSS/MUI)

  return (
    <Stack
      spacing={4}
      sx={{
        position: 'sticky',
        top: 24,
        height: 'fit-content',
        pb: 4,
      }}
    >
      <SearchBar />

      {!isAuthenticated && (
        <Box
          sx={{
            p: 3,
            borderRadius: '24px',
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant='h6'
            fontWeight={800}
            sx={{ mb: 1, letterSpacing: '-0.02em' }}
          >
            ¿Nuevo en Aura?
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Únete ahora para obtener tu propio feed personalizado y conectar con
            la comunidad.
          </Typography>
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '50px',
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: `0 4px 14px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: '50px',
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Crear cuenta
            </Button>
          </Stack>
        </Box>
      )}

      {isAuthenticated && <SuggestedUsers />}

      <NodeList />

      <Box sx={{ px: 3, mt: 2 }}>
        <Stack
          direction='row'
          spacing={1.5}
          flexWrap='wrap'
          useFlexGap
          sx={{ opacity: 0.5 }}
        >
          {['Privacidad', 'Condiciones', 'Publicidad', 'Aura Info'].map(
            item => (
              <Typography
                key={item}
                variant='caption'
                color='text.secondary'
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main', textDecoration: 'none' },
                }}
              >
                {item}
              </Typography>
            )
          )}
        </Stack>
        <Typography
          variant='caption'
          color='text.disabled'
          display='block'
          sx={{
            mt: 2,
            fontSize: '0.65rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.4,
          }}
        >
          © 2026 Aura Collective · Lienzo de Pensamientos
        </Typography>
      </Box>
    </Stack>
  )
}
