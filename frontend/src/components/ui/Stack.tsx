import React from 'react'
import { Stack as MuiStack, StackProps as MuiStackProps } from '@mui/material'

export interface StackProps extends MuiStackProps {
  children: React.ReactNode
  component?: React.ElementType
  to?: string
  disabled?: boolean
  href?: string
  type?: string
}

/**
 * Componente para layouts flexibles (Flexbox).
 * Por defecto es vertical (direction="column").
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiStack ref={ref} {...props}>
        {children}
      </MuiStack>
    )
  }
)

Stack.displayName = 'Stack'
