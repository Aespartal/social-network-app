import React from 'react'
import { Alert as MuiAlert, AlertTitle, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export interface AlertProps extends React.ComponentProps<typeof MuiAlert> {
  title?: string
  children: React.ReactNode
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  children,
  onClose,
  ...props
}) => {
  return (
    <MuiAlert
      severity={severity}
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
