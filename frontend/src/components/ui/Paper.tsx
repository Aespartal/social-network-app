import React from 'react'
import { Paper as MuiPaper, PaperProps as MuiPaperProps } from '@mui/material'

export interface PaperProps extends MuiPaperProps {
  children: React.ReactNode
}

/**
 * Componente para superficies elevadas o con fondo.
 * Proxy para el Paper de MUI.
 */
export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiPaper ref={ref} {...props}>
        {children}
      </MuiPaper>
    )
  }
)

Paper.displayName = 'Paper'
