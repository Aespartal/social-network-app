import React from 'react'
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'

import { tokens, type FontSizeToken } from '@/theme/tokens'

export interface TextProps extends MuiTypographyProps {
  children?: React.ReactNode
  component?: React.ElementType
  to?: string
  /** Tamaño de fuente - usa tokens.fontSize (opcional, sobreescribe fontSize) */
  size?: FontSizeToken
  /** Peso de fuente - usa tokens.fontWeight (opcional, sobreescribe fontWeight) */
  weight?: keyof typeof tokens.fontWeight
}

/**
 * Componente base para textos.
 * Abstrae el Typography de MUI para facilitar futuros cambios de diseño.
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ children, size, weight, sx, ...props }, ref) => {
    const customSx = {
      ...(size && { fontSize: tokens.fontSize[size] }),
      ...(weight && { fontWeight: tokens.fontWeight[weight] }),
      ...sx,
    }

    return (
      <MuiTypography ref={ref} sx={customSx} {...props}>
        {children}
      </MuiTypography>
    )
  }
)

Text.displayName = 'Text'
export type { TextProps as TypographyProps }
