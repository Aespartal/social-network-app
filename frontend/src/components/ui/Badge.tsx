import React from 'react'
import { Chip } from '@mui/material'

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  // Map our custom variants to Material-UI colors
  const getMuiColor = () => {
    switch (variant) {
      case 'secondary':
        return 'secondary' as const
      case 'success':
        return 'success' as const
      case 'warning':
        return 'warning' as const
      case 'error':
        return 'error' as const
      default:
        return 'primary' as const
    }
  }

  // Map our custom sizes to Material-UI sizes
  const getMuiSize = () => {
    switch (size) {
      case 'sm':
        return 'small' as const
      default:
        return 'medium' as const
    }
  }

  return (
    <Chip
      label={children}
      color={getMuiColor()}
      size={getMuiSize()}
      variant='filled'
      {...props}
    />
  )
}
