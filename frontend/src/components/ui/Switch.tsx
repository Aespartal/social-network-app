import React from 'react'
import {
  Switch as MuiSwitch,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from '@mui/material'

export interface SwitchProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string
  helperText?: string
  color?: 'primary' | 'secondary' | 'default'
  size?: 'small' | 'medium'
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom'
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  helperText,
  color = 'primary',
  size = 'medium',
  labelPlacement = 'end',
}) => {
  const switchComponent = (
    <MuiSwitch
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
      color={color}
      size={size}
    />
  )

  if (!label && !error && !helperText) {
    return switchComponent
  }

  return (
    <FormControl error={!!error} disabled={disabled}>
      {label ? (
        <FormControlLabel
          control={switchComponent}
          label={label}
          labelPlacement={labelPlacement}
        />
      ) : (
        switchComponent
      )}
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
