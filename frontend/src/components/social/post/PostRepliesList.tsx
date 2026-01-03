import { Stack, Typography } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import { StyledPostCard } from './PostCard.styles'

interface PostRepliesListProps {
  replies: Post[]
  onLike: (id: string) => Promise<void>
  onBookmark: (id: string) => Promise<void>
  onReply: (post: Post) => void
}

export const PostRepliesList = ({
  replies,
  onLike,
  onBookmark,
  onReply,
}: PostRepliesListProps) => {
  if (!replies || replies.length === 0) {
    return (
      <Typography color='text.secondary' sx={{ p: 4, textAlign: 'center' }}>
        Aún no hay respuestas. ¡Sé el primero!
      </Typography>
    )
  }

  return (
    <Stack spacing={0}>
      {replies.map(reply => (
        <StyledPostCard
          key={reply.id}
          post={reply}
          onLike={() => onLike(reply.id)}
          onBookmark={() => onBookmark(reply.id)}
          onReply={() => onReply(reply)}
          sx={{ border: 'none' }}
        />
      ))}
    </Stack>
  )
}
