import React from 'react'
import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { getCreatePostStyles } from '../CreatePost.styles'

type CreatePostStyles = ReturnType<typeof getCreatePostStyles>

interface PostImagePreviewProps {
  url: string
  onRemove: () => void
  loading: boolean
  styles: CreatePostStyles
}

export const PostImagePreview: React.FC<PostImagePreviewProps> = ({
  url,
  onRemove,
  loading,
  styles,
}) => {
  return (
    <Box sx={styles.imagePreviewContainer}>
      <IconButton
        onClick={onRemove}
        disabled={loading}
        sx={styles.removeImageBtn}
        size='small'
      >
        <CloseIcon fontSize='small' />
      </IconButton>
      <Box
        component='img'
        src={url}
        alt='Preview'
        sx={{
          width: '100%',
          maxHeight: 350,
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  )
}
