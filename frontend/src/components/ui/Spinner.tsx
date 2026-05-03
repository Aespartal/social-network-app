import React from 'react'
import {
  CircularProgress as MuiSpinner,
  CircularProgressProps as MuiSpinnerProps,
} from '@mui/material'

export type SpinnerProps = MuiSpinnerProps

/**
 * Componente de carga (Icono).
 * Proxy para el CircularProgress de MUI.
 */
export const Spinner: React.FC<SpinnerProps> = ({ ...props }) => {
  return <MuiSpinner {...props} />
}
