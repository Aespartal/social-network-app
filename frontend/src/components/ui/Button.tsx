import React from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof MuiButton>,
  'variant' | 'size'
> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'contained'
    | 'outlined'
    | 'text'
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'
  loading?: boolean
  children: React.ReactNode
  component?: React.ElementType
  to?: string
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
      case 'contained':
        return { variant: 'contained' as const, color: 'primary' as const }
      case 'secondary':
        return { variant: 'contained' as const, color: 'secondary' as const }
      case 'destructive':
        return { variant: 'contained' as const, color: 'error' as const }
      case 'outline':
      case 'outlined':
        return { variant: 'outlined' as const, color: 'primary' as const }
      case 'ghost':
      case 'text':
        return { variant: 'text' as const, color: 'primary' as const }
      default:
        return { variant: 'contained' as const, color: 'primary' as const }
    }
  }

  // Map our custom sizes to Material-UI sizes
  const getMuiSize = () => {
    switch (size) {
      case 'sm':
      case 'small':
        return 'small' as const
      case 'lg':
      case 'large':
        return 'large' as const
      case 'md':
      case 'medium':
        return 'medium' as const
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
