import React from 'react'
import { Box, Typography, alpha, useTheme } from '@mui/material'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const theme = useTheme()

  const getDim = () => {
    switch (size) {
      case 'sm':
        return 30
      case 'lg':
        return 100
      default:
        return 60
    }
  }

  const dim = getDim()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      {/* El Aura Pulsante (Biofílica) */}
      <Box
        sx={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          position: 'relative',
          bgcolor: alpha(theme.palette.primary.main, 0.2),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            bgcolor: theme.palette.primary.main,
            opacity: 0.5,
            animation: 'aura-breathe 2s infinite ease-in-out',
          },
          '@keyframes aura-breathe': {
            '0%': {
              transform: 'scale(0.8)',
              opacity: 0.3,
              filter: 'blur(5px)',
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: 0.6,
              filter: 'blur(15px)',
            },
            '100%': {
              transform: 'scale(0.8)',
              opacity: 0.3,
              filter: 'blur(5px)',
            },
          },
        }}
      />

      {text && (
        <Typography
          variant='body2'
          sx={{
            opacity: 0.6,
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  )
}
