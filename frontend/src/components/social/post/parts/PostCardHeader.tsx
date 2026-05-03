import React from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import type { getPostCardStyles } from '../PostCard.styles'
import { Box } from '@/components/ui/Box'

type PostCardStyles = ReturnType<typeof getPostCardStyles>

interface PostCardHeaderProps {
  post: Post
  styles: PostCardStyles
}

export const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  post,
  styles,
}) => {
  const topic = post.tags?.[0]?.tag?.name || 'Aura'

  return (
    <Box sx={styles.header}>
      <Box sx={styles.tag}>#{topic}</Box>
    </Box>
  )
}
