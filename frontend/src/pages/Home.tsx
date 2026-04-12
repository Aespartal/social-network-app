import React, { useCallback, useState } from 'react'
import {
  Box,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Button,
} from '@mui/material'

// Styles
import { HomeContainer, MainColumn, SidebarContainer } from './Home.styles'

// Hooks
import { useAuth, useFeed } from '@/hooks'
import { FEED_TABS_CONFIG } from '@/constants/feed'

// Componentes Sociales
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { AuthPlaceholder } from '@/components/social/AuthPlaceholder'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { HomeHeader } from '@/components/social/home/HomeHeader'
import { HomeFeed } from '@/components/social/home/HomeFeed'
import { Post } from 'social-network-app-shared/types/social.type'

export const Home: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue)
    },
    []
  )

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
  } = useFeed(activeTab)

  const handleLoadMore = useCallback(() => {
    if (!loadingMore) {
      loadFeed(false)
    }
  }, [loadFeed, loadingMore])

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

  if (!isAuthenticated) return <AuthPlaceholder />

  return (
    <HomeContainer>
      {/* 1. COLUMNA PRINCIPAL (Feed) - Centrada y con ancho controlado */}
      <MainColumn>
        {/* Header de Home (Tabs) */}
        <HomeHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabsConfig={FEED_TABS_CONFIG}
        />

        <Stack>
          <CreatePostAction
            onSave={handleCreatePost}
            loading={isCreating}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />

          <Divider sx={{ opacity: 0.5 }} />

          {error && (
            <Box sx={{ p: 2 }}>
              <Alert
                severity='error'
                variant='outlined'
                sx={{ borderRadius: 3 }}
                action={
                  <Button
                    color='inherit'
                    size='small'
                    onClick={() => loadFeed(true)}
                  >
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            </Box>
          )}

          <HomeFeed
            loading={loading}
            posts={posts}
            onLike={handleToggleLike}
            onBookmark={handleToggleBookmark}
            onReply={setReplyToPost}
            hasMore={hasMorePosts}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        </Stack>
      </MainColumn>

      {/* 2. COLUMNA LATERAL (Sugerencias) - Solo en desktop */}
      <SidebarContainer>
        <HomeSidebar />
      </SidebarContainer>
    </HomeContainer>
  )
}

export default Home
