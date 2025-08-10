import React from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface ButtonProps
  extends Omit<React.ComponentProps<typeof MuiButton>, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: prop => prop !== 'loading',
})<{ loading?: boolean }>(({ loading }) => ({
  position: 'relative',
  '&.Mui-disabled': {
    opacity: loading ? 1 : 0.5,
  },
}))

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}) => {
  // Map our custom variants to Material-UI variants and colors
  const getMuiProps = () => {
    switch (variant) {
      case 'primary':
        return { variant: 'contained' as const, color: 'primary' as const }
      case 'secondary':
        return { variant: 'contained' as const, color: 'secondary' as const }
      case 'destructive':
        return { variant: 'contained' as const, color: 'error' as const }
      case 'outline':
        return { variant: 'outlined' as const, color: 'primary' as const }
      case 'ghost':
        return { variant: 'text' as const, color: 'primary' as const }
      default:
        return { variant: 'contained' as const, color: 'primary' as const }
    }
  }

  // Map our custom sizes to Material-UI sizes
  const getMuiSize = () => {
    switch (size) {
      case 'sm':
        return 'small' as const
      case 'lg':
        return 'large' as const
      default:
        return 'medium' as const
    }
  }

  const { variant: muiVariant, color } = getMuiProps()
  const muiSize = getMuiSize()

  return (
    <StyledButton
      variant={muiVariant}
      color={color}
      size={muiSize}
      disabled={disabled || loading}
      loading={loading}
      startIcon={
        loading ? <CircularProgress size={16} color='inherit' /> : undefined
      }
      {...props}
    >
      {children}
    </StyledButton>
  )
}
