import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  actions?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  actions,
}) => {
  // Map our custom sizes to Material-UI maxWidth
  const getMuiSize = () => {
    switch (size) {
      case 'sm':
        return 'sm' as const
      case 'lg':
        return 'lg' as const
      case 'xl':
        return 'xl' as const
      default:
        return 'md' as const
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth={getMuiSize()} fullWidth>
      {title && (
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' component='h2'>
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                color: theme => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent dividers={!!title}>{children}</DialogContent>

      {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </Dialog>
  )
}
