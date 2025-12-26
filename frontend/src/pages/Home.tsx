import React, { useEffect } from 'react'
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useFeed } from '@/hooks/useFeed'
import { FeedSkeleton } from '@/components/social/FeedSkeleton'
import { PostList } from '@/components/social/PostList'
import { CreatePostAction } from '@/components/social/CreatePostAction'
import { AuthPlaceholder } from '@/components/social/AuthPlaceholder'

const Home: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMorePosts,
    loadFeed,
    handleToggleLike,
    handleCreatePost,
    isCreating,
  } = useFeed()

  useEffect(() => {
    if (isAuthenticated && posts.length === 0) loadFeed(true)
  }, [isAuthenticated, loadFeed, posts.length])

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <AuthPlaceholder />

  return (
    <Container maxWidth='sm'>
      <Box py={3}>
        <Typography variant='h5' fontWeight='bold' gutterBottom>
          Tu Feed
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
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
          />
        )}

        <CreatePostAction onSave={handleCreatePost} loading={isCreating} />
      </Box>
    </Container>
  )
}

export default Home
