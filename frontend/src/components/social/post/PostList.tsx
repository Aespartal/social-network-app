import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { StyledPostCard } from './PostCard.styles'

interface PostListProps {
  posts: Post[]
  onLike: (id: string) => Promise<void>
  onBookmark: (id: string) => Promise<void>
  onReply: (post: Post) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

export const PostList = ({
  posts,
  onLike,
  onBookmark,
  onReply,
  hasMore,
  loadingMore,
  onLoadMore,
}: PostListProps) => {
  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onIntersect: onLoadMore,
  })

  if (posts.length === 0) {
    return (
      <Box textAlign='center' py={10}>
        <Typography color='text.secondary'>No hay publicaciones.</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {posts.map((post, index) => {
        const isLastPost = posts.length === index + 1

        return (
          <div key={post.id} ref={isLastPost ? lastElementRef : null}>
            <StyledPostCard
              key={post.id}
              post={post}
              onLike={() => onLike(post.id)}
              onBookmark={() => onBookmark(post.id)}
              onReply={() => onReply(post)}
            />
          </div>
        )
      })}

      {loadingMore && (
        <Box display='flex' justifyContent='center' py={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  )
}
