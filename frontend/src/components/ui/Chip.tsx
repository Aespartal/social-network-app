import React from 'react'
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material'

export type ChipProps = MuiChipProps

/**
 * Componente de etiqueta semi-redondeada.
 * Proxy para el Chip de MUI.
 */
export const Chip: React.FC<ChipProps> = ({ ...props }) => {
  return <MuiChip {...props} />
}
