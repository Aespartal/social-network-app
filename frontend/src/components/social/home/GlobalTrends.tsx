import React from 'react'
import { Box, Text as Typography, Button, Chip } from '@/components/ui'
import { alpha, useTheme } from '@mui/material'

const TRENDS = ['#hashtags', '#tendencia', '#pandalas', '#topicias']

export const GlobalTrends: React.FC = () => {
  const theme = useTheme()

  const containerStyle = {
    borderRadius: theme.tokens.borderRadius.aura,
    overflow: 'hidden',
    bgcolor: alpha('#13191E', 0.7),
    backdropFilter: 'blur(15px)',
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    p: 3,
    position: 'relative',
    '&::before':
      theme.palette.mode === 'dark'
        ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.02,
            pointerEvents: 'none',
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/stardust.png")',
          }
        : {},
  }

  return (
    <Box sx={containerStyle}>
      <Typography
        variant='subtitle1'
        sx={{
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          mb: 3,
          letterSpacing: '0.02em',
          opacity: 0.9,
        }}
      >
        Tendencias Globales
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        {TRENDS.map(tag => (
          <Chip
            key={tag}
            label={tag}
            sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.05),
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant='ghost'
          size='small'
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.8rem',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          Ver más montas afinas
        </Button>
      </Box>
    </Box>
  )
}
