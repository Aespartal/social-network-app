import { Box, CircularProgress, Typography } from '@mui/material'
import { Post } from 'social-network-app-shared/types/social.type'
import { Virtuoso } from 'react-virtuoso'
import { StyledPostCard } from './PostCard.styles'

interface PostListProps {
  posts: Post[]
  onLike: (id: string) => void
  onBookmark: (id: string) => void
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
  if (posts.length === 0 && !loadingMore) {
    return (
      <Box
        textAlign='center'
        py={12}
        px={4}
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={2}
      >
        <Typography variant='h6' fontWeight={700}>
          No hay nada que ver por aquí... todavía
        </Typography>
      </Box>
    )
  }

  return (
    <Virtuoso
      useWindowScroll
      data={posts}
      endReached={() => {
        if (hasMore && !loadingMore) {
          onLoadMore()
        }
      }}
      itemContent={(index, post) => {
        const nextPost = posts[index + 1]
        const prevPost = posts[index - 1]

        const isThreadParent = nextPost && nextPost.parentId === post.id
        const isThreadChild = prevPost && post.parentId === prevPost.id

        return (
          <Box sx={{ pb: 0 }}>
            <StyledPostCard
              post={post}
              isThreadParent={isThreadParent}
              isThreadChild={isThreadChild}
              onLike={() => onLike(post.id)}
              onBookmark={() => onBookmark(post.id)}
              onReply={() => onReply(post)}
            />
          </Box>
        )
      }}
      components={{
        Footer: () => {
          if (!loadingMore) return null
          return (
            <Box display='flex' justifyContent='center' py={4}>
              <CircularProgress size={24} />
            </Box>
          )
        },
      }}
    />
  )
}
