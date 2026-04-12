import React from 'react'
import { Dialog, Box, IconButton, Fade } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface ImageModalProps {
  open: boolean
  onClose: () => void
  imageUrl: string
  altText?: string
}

export const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onClose,
  imageUrl,
  altText = 'Imagen a pantalla completa',
}) => {
  if (!imageUrl) return null

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image Container */}
        <Box
          component='img'
          src={imageUrl}
          alt={altText}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            userSelect: 'none',
          }}
          onClick={e => e.stopPropagation()}
        />
      </Box>
    </Dialog>
  )
}
