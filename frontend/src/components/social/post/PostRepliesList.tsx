import { Stack, Typography, Box } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import { PostCard } from './PostCard'

interface PostRepliesListProps {
  replies: Post[]
  onLike: (id: string) => void
  onBookmark: (id: string) => void
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
      <Box sx={{ p: 8, textAlign: 'center', opacity: 0.5 }}>
        <Typography
          variant='body1'
          sx={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}
        >
          El silencio impera aquí...
        </Typography>
        <Typography variant='caption'>
          Aún no hay ecos de este pensamiento. Sé el primero en expandir la
          idea.
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {replies.map(reply => (
        <PostCard
          key={reply.id}
          post={reply}
          onLike={() => onLike(reply.id)}
          onBookmark={() => onBookmark(reply.id)}
          onReply={() => onReply(reply)}
        />
      ))}
    </Stack>
  )
}
