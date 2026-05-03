import React from 'react'
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'

export interface TextProps extends MuiTypographyProps {
  children?: React.ReactNode
  component?: React.ElementType
  to?: string
}

/**
 * Componente base para textos.
 * Abstrae el Typography de MUI para facilitar futuros cambios de diseño.
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiTypography ref={ref} {...props}>
        {children}
      </MuiTypography>
    )
  }
)

Text.displayName = 'Text'
export type { TextProps as TypographyProps }
