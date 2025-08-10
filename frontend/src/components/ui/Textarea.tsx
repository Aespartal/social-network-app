import React from 'react'
import { TextField } from '@mui/material'

export interface TextareaProps
  extends Omit<React.ComponentProps<typeof TextField>, 'error' | 'multiline'> {
  label?: string
  error?: string
  helperText?: string
  rows?: number
  maxRows?: number
  variant?: 'outlined' | 'filled' | 'standard'
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  rows = 4,
  maxRows,
  variant = 'outlined',
  resize = 'vertical',
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={!!error}
      helperText={error || helperText}
      variant={variant}
      multiline
      rows={rows}
      maxRows={maxRows}
      fullWidth
      sx={{
        '& .MuiInputBase-input': {
          resize: resize,
        },
      }}
      {...props}
    />
  )
}
