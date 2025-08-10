import React from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material'

export interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  label?: string
  value: string | number
  onChange: (value: string | number) => void
  options: RadioOption[]
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  row?: boolean
  color?: 'primary' | 'secondary' | 'default'
  size?: 'small' | 'medium'
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  disabled = false,
  required = false,
  row = false,
  color = 'primary',
  size = 'medium',
}) => {
  return (
    <FormControl error={!!error} disabled={disabled} required={required}>
      {label && <FormLabel component='legend'>{label}</FormLabel>}
      <MuiRadioGroup
        value={value}
        onChange={e => onChange(e.target.value)}
        row={row}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio color={color} size={size} disabled={option.disabled} />
            }
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </MuiRadioGroup>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
