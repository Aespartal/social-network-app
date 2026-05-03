import React from 'react'
import { Box, Typography } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import type { getPostCardStyles } from '../PostCard.styles'

type PostCardStyles = ReturnType<typeof getPostCardStyles>

interface PostCardHeaderProps {
  post: Post
  styles: PostCardStyles
}

export const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  post,
  styles,
}) => {
  // Obtener el primer tag o un tema por defecto
  const topic = post.tags?.[0]?.tag?.name || 'Aura'

  // Usamos el tiempo de lectura calculado por el backend
  const readingTime = post.readingTime || 1

  return (
    <Box sx={styles.header}>
      <Box sx={styles.tag}>#{topic}</Box>
      <Typography sx={styles.readingTime}>
        {readingTime} min de lectura
      </Typography>
    </Box>
  )
}
