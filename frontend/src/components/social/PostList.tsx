import {
  Box,
  Button,
  CircularProgress,
  Grow,
  Stack,
  Typography,
} from '@mui/material'
import { PostCard } from './PostCard'
import { Post } from 'social-network-app-shared/types/social'

interface PostListProps {
  posts: Post[]
  onLike: (id: string) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

export const PostList = ({
  posts,
  onLike,
  hasMore,
  loadingMore,
  onLoadMore,
}: PostListProps) => {
  if (posts.length === 0) {
    return (
      <Box textAlign='center' py={10}>
        <Typography color='text.secondary'>
          No hay publicaciones para mostrar.
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => onLike(post.id)}
          onBookmark={() => {}}
        />
      ))}

      {hasMore && (
        <Box textAlign='center' py={2}>
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant='text'
            startIcon={loadingMore && <CircularProgress size={16} />}
          >
            {loadingMore ? 'Cargando...' : 'Cargar más publicaciones'}
          </Button>
        </Box>
      )}
    </Stack>
  )
}
