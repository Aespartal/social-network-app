import React from 'react'
import { Box } from '@/components/ui'
import { Link } from 'react-router-dom'
import { OptimizedAvatar } from '@/components/common'
import { PostThreadLine } from './PostThreadLine'
import { Post } from 'social-network-app-shared/types/social.type'

type Styles = Record<string, any>

interface PostCardAvatarProps {
  post: Post
  styles: Styles
  isThreadParent: boolean
  isThreadChild: boolean
}

export const PostCardAvatar: React.FC<PostCardAvatarProps> = ({
  post,
  styles,
  isThreadParent,
  isThreadChild,
}) => {
  return (
    <Box sx={{ ...styles.avatarColumn }}>
      <PostThreadLine
        isThreadParent={isThreadParent}
        isThreadChild={isThreadChild}
      />

      <Link
        to={`/profile/${post.author?.username}`}
        style={styles.avatarLink as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <OptimizedAvatar
          src={post.author?.avatar}
          alt={post.author?.name}
          size='md'
          lazy={true}
          sx={styles.avatarBorder}
        />
      </Link>
    </Box>
  )
}
