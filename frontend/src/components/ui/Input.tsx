import React from 'react'
import { TextField } from '@mui/material'

export interface InputProps extends React.ComponentProps<typeof TextField> {
  label?: string
  error?: boolean
  errorMessage?: string
  variant?: 'outlined' | 'filled' | 'standard'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  errorMessage,
  helperText,
  variant = 'outlined',
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={error}
      helperText={errorMessage || helperText}
      variant={variant}
      fullWidth
      {...props}
    />
  )
}
