import React from 'react'
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@mui/material'

export interface IconButtonProps extends MuiIconButtonProps {
  children: React.ReactNode
}

/**
 * Componente de botón de icono.
 * Proxy para el IconButton de MUI.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiIconButton ref={ref} {...props}>
        {children}
      </MuiIconButton>
    )
  }
)

IconButton.displayName = 'IconButton'
