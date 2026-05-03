import React from 'react'
import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material'

export interface BoxProps extends MuiBoxProps {
  children?: React.ReactNode
  component?: React.ElementType
  to?: string
  disabled?: boolean
  href?: string
  type?: string
}

/**
 * Componente base para contenedores.
 * Actúa como un proxy para el Box de MUI.
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiBox ref={ref} {...props}>
        {children}
      </MuiBox>
    )
  }
)

Box.displayName = 'Box'
