import React from 'react'
import { Box, Text as Typography, Button, Chip } from '@/components/ui'
import { alpha, useTheme } from '@mui/material'

const TRENDS = [
  { tag: '#meditación', resonance: 'Alta', color: '#88B04B' },
  { tag: '#minimalismo', resonance: 'Media', color: '#E0FF4F' },
  { tag: '#aura', resonance: 'Creciendo', color: '#00D1FF' },
  { tag: '#bienestar', resonance: 'Estable', color: '#FF7D00' },
]

export const GlobalTrends: React.FC = () => {
  const theme = useTheme()

  const nodeStyle = {
    padding: theme.spacing(2),
    borderRadius: '24px',
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(15px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    mb: 2,
    '&:hover': {
      transform: 'translateY(-5px)',
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      borderColor: theme.palette.primary.main,
      boxShadow:
        theme.palette.mode === 'dark'
          ? `0 12px 24px rgba(0, 0, 0, 0.3)`
          : `0 12px 24px rgba(0, 0, 0, 0.05)`,
    },
  }

  return (
    <Box sx={{ px: 1 }}>
      <Typography
        variant='subtitle1'
        sx={{
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          mb: 2,
          ml: 1,
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}
      >
        Comunidades
      </Typography>

      {TRENDS.map(node => (
        <Box key={node.tag} sx={nodeStyle}>
          <Typography
            variant='body1'
            sx={{ color: node.color, fontWeight: 800, fontSize: '1rem' }}
          >
            {node.tag}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.65rem',
              fontWeight: 700,
              opacity: 0.5,
            }}
          >
            Actividad: {node.resonance}
          </Typography>
        </Box>
      ))}

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Button
          variant='ghost'
          size='small'
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.6,
            '&:hover': { color: 'primary.main', opacity: 1 },
          }}
        >
          Explorar más nodos
        </Button>
      </Box>
    </Box>
  )
}
