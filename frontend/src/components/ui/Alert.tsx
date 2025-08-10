import React from 'react'
import { Alert as MuiAlert, AlertTitle, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export interface AlertProps
  extends Omit<React.ComponentProps<typeof MuiAlert>, 'variant'> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  ...props
}) => {
  return (
    <MuiAlert
      severity={variant}
      action={
        onClose && (
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={onClose}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        )
      }
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  )
}
