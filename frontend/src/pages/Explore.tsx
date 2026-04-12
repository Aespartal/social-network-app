import React, { useCallback } from 'react'
import {
  Box,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  Typography,
  alpha,
} from '@mui/material'

// Hooks
import { useExplore } from '@/hooks'

// Componentes Sociales
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { PostList } from '@/components/social/post/PostList'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { SearchBar } from '@/components/social/home/SearchBar'
import { Post } from 'social-network-app-shared/types/social.type'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'

export const Explore: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [replyToPost, setReplyToPost] = React.useState<Post | null>(null)

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMorePosts,
    loadMore,
    handleToggleLike,
    handleToggleBookmark,
    handleCreatePost,
    isCreating,
  } = useExplore()

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMorePosts) {
      loadMore()
    }
  }, [loadMore, loadingMore, hasMorePosts])

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100%',
      }}
    >
      {/* 1. COLUMNA PRINCIPAL */}
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: '600px',
          borderRight: '1px solid',
          borderColor: 'divider',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Header de Explorar */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 1,
          }}
        >
          <SearchBar placeholder='Buscar en Explorar' />
          <Box sx={{ mt: 1, px: 2 }}>
            <Typography variant='h6' fontWeight={800}>
              Tendencias para ti
            </Typography>
          </Box>
        </Box>

        <Stack>
          {replyToPost && (
            <CreatePostAction
              onSave={handleCreatePost}
              loading={isCreating}
              replyToPost={replyToPost}
              onCloseReply={() => setReplyToPost(null)}
            />
          )}

          {error && (
            <Box sx={{ p: 2 }}>
              <Alert
                severity='error'
                variant='outlined'
                sx={{ borderRadius: 3 }}
              >
                {error}
              </Alert>
            </Box>
          )}

          {loading && posts.length === 0 ? (
            <FeedSkeleton />
          ) : (
            <PostList
              posts={posts}
              onLike={id => handleToggleLike(id)}
              hasMore={hasMorePosts}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMore}
              onBookmark={id => handleToggleBookmark(id)}
              onReply={post => setReplyToPost(post)}
            />
          )}
        </Stack>
      </Box>

      {/* 2. COLUMNA LATERAL */}
      {!isMobile && (
        <Box
          sx={{
            width: '350px',
            p: 2,
            display: { xs: 'none', lg: 'block' },
            flexShrink: 0,
          }}
        >
          <HomeSidebar />
        </Box>
      )}
    </Box>
  )
}

export default Explore
