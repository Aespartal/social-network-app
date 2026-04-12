import { memo } from 'react'
import { Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Post } from 'social-network-app-shared/types/social.type'
import { formatTimeAgo } from '@/utils/date'

interface PostCardHeaderProps {
  post: Post
}

export const PostCardHeader = memo(({ post }: PostCardHeaderProps) => {
  return (
    <Stack direction='row' spacing={0.5} alignItems='center' mb={0.5}>
      <Typography
        variant='subtitle2'
        component={Link}
        to={`/profile/${post.author?.username}`}
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 'bold',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {post.author?.name}
      </Typography>
      <Typography variant='caption' color='text.secondary'>
        @{post.author?.username}
      </Typography>
      <Typography variant='caption' color='text.secondary'>
        ·
      </Typography>
      <Typography
        variant='caption'
        color='text.secondary'
        sx={{ whiteSpace: 'nowrap' }}
      >
        {formatTimeAgo(post.createdAt)}
      </Typography>

      {(post.city || post.country) && (
        <>
          <Typography variant='caption' color='text.secondary'>
            ·
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              opacity: 0.8,
              fontStyle: 'italic',
            }}
          >
            {post.city}
            {post.city && post.country ? ', ' : ''}
            {post.country}
          </Typography>
        </>
      )}
    </Stack>
  )
})
