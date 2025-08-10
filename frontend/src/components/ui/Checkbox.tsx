import React from 'react'
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from '@mui/material'

export interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string
  helperText?: string
  required?: boolean
  color?: 'primary' | 'secondary' | 'default'
  size?: 'small' | 'medium' | 'large'
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  helperText,
  required = false,
  color = 'primary',
  size = 'medium',
}) => {
  const checkbox = (
    <MuiCheckbox
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
      required={required}
      color={color}
      size={size}
    />
  )

  if (!label && !error && !helperText) {
    return checkbox
  }

  return (
    <FormControl error={!!error} disabled={disabled}>
      {label ? <FormControlLabel control={checkbox} label={label} /> : checkbox}
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
