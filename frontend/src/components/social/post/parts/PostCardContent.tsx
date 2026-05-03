import React, { useState } from 'react'
import { Box, Typography, Fade } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import type { getPostCardStyles } from '../PostCard.styles'

type PostCardStyles = ReturnType<typeof getPostCardStyles>

interface PostCardContentProps {
  post: Post
  styles: PostCardStyles
  onImageClick?: (e: React.MouseEvent) => void
}

export const PostCardContent: React.FC<PostCardContentProps> = ({
  post,
  styles,
  onImageClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const isLong = post.content.length > 280

  // Intentar extraer un "título" si hay saltos de línea (la primera línea)
  const lines = post.content.split('\n')
  const hasPotentialTitle = lines.length > 1 && lines[0].length < 60
  const title = hasPotentialTitle ? lines[0] : null
  const body = hasPotentialTitle
    ? lines.slice(1).join('\n').trim()
    : post.content

  return (
    <Box sx={styles.contentArea}>
      {title && <Typography sx={styles.title}>{title}</Typography>}

      <Typography sx={styles.text(isLong)}>{body}</Typography>

      {post.image && (
        <Box
          sx={{
            ...styles.media,
            minHeight: imageLoaded ? 'auto' : '200px',
            bgcolor: imageLoaded ? 'transparent' : 'rgba(0,0,0,0.05)',
            transition: 'background-color 0.5s ease',
          }}
          onClick={onImageClick}
        >
          <Fade in={imageLoaded} timeout={1000}>
            <Box
              component='img'
              src={post.image}
              alt='Content'
              onLoad={() => setImageLoaded(true)}
              sx={{ width: '100%', display: 'block' }}
            />
          </Fade>
        </Box>
      )}
    </Box>
  )
}
