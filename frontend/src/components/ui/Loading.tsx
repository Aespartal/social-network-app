import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  color?: 'primary' | 'secondary' | 'inherit'
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  color = 'primary',
}) => {
  // Map our custom sizes to Material-UI sizes
  const getMuiSize = () => {
    switch (size) {
      case 'sm':
        return 20
      case 'lg':
        return 60
      default:
        return 40
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <CircularProgress size={getMuiSize()} color={color} />
      {text && (
        <Typography variant='body2' color='text.secondary'>
          {text}
        </Typography>
      )}
    </Box>
  )
}
