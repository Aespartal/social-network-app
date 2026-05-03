import React from 'react'
import {
  Container as MuiContainer,
  ContainerProps as MuiContainerProps,
} from '@mui/material'

export interface ContainerProps extends MuiContainerProps {
  children: React.ReactNode
}

/**
 * Componente de contención principal.
 * Proxy para el Container de MUI.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiContainer ref={ref} {...props}>
        {children}
      </MuiContainer>
    )
  }
)

Container.displayName = 'Container'
