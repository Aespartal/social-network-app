import React from 'react'
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
} from '@mui/material'

export interface TooltipProps extends MuiTooltipProps {
  children: React.ReactElement
}

/**
 * Componente de información emergente.
 * Proxy para el Tooltip de MUI.
 */
export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  return <MuiTooltip {...props}>{children}</MuiTooltip>
}
