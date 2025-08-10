import React from 'react'
import { TextField } from '@mui/material'

export interface InputProps
  extends Omit<React.ComponentProps<typeof TextField>, 'error'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'outlined' | 'filled' | 'standard'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={!!error}
      helperText={error || helperText}
      variant={variant}
      fullWidth
      {...props}
    />
  )
}
