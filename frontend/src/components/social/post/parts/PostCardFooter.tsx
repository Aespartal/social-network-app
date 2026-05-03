import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { OptimizedAvatar } from '@/components/common'
import { Post } from 'social-network-app-shared/types/social.type'
import type { getPostCardStyles } from '../PostCard.styles'

type PostCardStyles = ReturnType<typeof getPostCardStyles>

interface PostCardFooterProps {
  post: Post
  styles: PostCardStyles
  actions: React.ReactNode
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  post,
  styles,
  actions,
}) => {
  return (
    <Box sx={styles.footer}>
      {/* Autor a la izquierda, pequeño y minimalista */}
      <Box
        component={Link}
        to={`/profile/${post.author?.username}`}
        sx={{ ...styles.authorInfo, textDecoration: 'none', color: 'inherit' }}
        onClick={e => e.stopPropagation()}
      >
        <OptimizedAvatar
          src={post.author?.avatar}
          alt={post.author?.name}
          size={24}
        />
        <Typography sx={styles.authorName}>{post.author?.name}</Typography>
      </Box>

      {/* Acciones a la derecha */}
      {actions}
    </Box>
  )
}
