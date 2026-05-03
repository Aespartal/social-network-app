import React from 'react'
import { Box, Text as Typography } from '@/components/ui'
import { OptimizedAvatar } from '@/components/common'
import { formatTimeAgo } from '@/utils/date'
import { ParentPost } from 'social-network-app-shared/types/social.type'
import { useNavigate } from 'react-router-dom'
import type { getPostHeroCardStyles } from '../PostHeroCard.styles'

type PostHeroCardStyles = ReturnType<typeof getPostHeroCardStyles>

interface PostParentPreviewProps {
  parent?: ParentPost
  styles: PostHeroCardStyles
}

export const PostParentPreview: React.FC<PostParentPreviewProps> = ({
  parent,
  styles,
}) => {
  const navigate = useNavigate()

  if (!parent || !parent.author) return null

  return (
    <Box
      sx={styles.parentPreview}
      onClick={e => {
        e.stopPropagation()
        navigate(`/post/${parent.id}`)
      }}
    >
      <Box sx={styles.parentHeader}>
        <OptimizedAvatar
          src={parent.author.avatar}
          alt={parent.author.name}
          size='xs'
          lazy={true}
        />
        <Typography variant='caption' fontWeight='bold' color='text.primary'>
          {parent.author.name}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          @{parent.author.username}
        </Typography>
        {parent.createdAt && (
          <>
            <Typography variant='caption' color='text.secondary'>
              ·
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {formatTimeAgo(parent.createdAt)}
            </Typography>
          </>
        )}
      </Box>
      <Typography
        variant='body2'
        color='text.secondary'
        sx={styles.parentContent}
      >
        {parent.content}
      </Typography>
    </Box>
  )
}
