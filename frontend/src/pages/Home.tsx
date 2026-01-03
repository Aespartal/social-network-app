import React, { useEffect, useState } from 'react'
import {
  Box,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useFeed } from '@/hooks/useFeed'

// Componentes Sociales
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { PostList } from '@/components/social/post/PostList'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { AuthPlaceholder } from '@/components/social/AuthPlaceholder'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { Post } from 'social-network-app-shared/types/social.type'

export const Home: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMorePosts,
    loadFeed,
    handleToggleLike,
    handleToggleBookmark,
    handleCreatePost,
    isCreating,
  } = useFeed()

  // Carga inicial
  useEffect(() => {
    if (isAuthenticated && posts.length === 0) {
      loadFeed(true)
    }
  }, [isAuthenticated, loadFeed, posts.length])

  // 1. Pantalla de carga global de Auth
  if (authLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='80vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  // 2. Estado para usuarios no logueados
  if (!isAuthenticated) return <AuthPlaceholder />

  return (
    <Grid container spacing={4}>
      {/* COLUMNA PRINCIPAL (Feed) */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack>
          <CreatePostAction
            onSave={handleCreatePost}
            loading={isCreating}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />

          {error && (
            <Alert severity='error' variant='outlined' sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {loading && posts.length === 0 ? (
            <FeedSkeleton />
          ) : (
            <PostList
              posts={posts}
              onLike={handleToggleLike}
              hasMore={hasMorePosts}
              loadingMore={loadingMore}
              onLoadMore={() => loadFeed(false)}
              onBookmark={handleToggleBookmark}
              onReply={post => setReplyToPost(post)}
            />
          )}
        </Stack>
      </Grid>

      {/* COLUMNA LATERAL (Sugerencias) */}
      {!isMobile && (
        <Grid size={{ md: 4 }}>
          <HomeSidebar />
        </Grid>
      )}
    </Grid>
  )
}

export default Home
