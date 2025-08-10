import React from 'react'
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@mui/material'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  value: string | number
  onChange: (value: string | number) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  variant?: 'outlined' | 'filled' | 'standard'
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  variant = 'outlined',
}) => {
  const labelId = `select-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!error}
      disabled={disabled}
      variant={variant}
      required={required}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        labelId={labelId}
        value={value}
        onChange={e => onChange(e.target.value)}
        label={label}
        displayEmpty={!!placeholder}
      >
        {placeholder && (
          <MenuItem value='' disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
