import React, { useState, useCallback } from 'react'
import { Box, Stack, Button, Alert, Loading } from '@/components/ui'
import { Fade } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

// Styles
import {
  HomeContainer,
  MainColumn,
  SidebarContainer,
  ContentWrapper,
} from './Home.styles'

// Hooks
import { useAuth, useFeed } from '@/hooks'
import { FEED_TABS_CONFIG } from '@/constants/feed'

// Componentes Sociales
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { AuthPlaceholder } from '@/components/social/AuthPlaceholder'
import { HomeHeader } from '@/components/social/home/HomeHeader'
import { HomeFeed } from '@/components/social/home/HomeFeed'
import { Post } from 'social-network-app-shared/types/social.type'
import { AuraSidebar } from '@/components/social/common/AuraSidebar'

export const Home: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue)
  }

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
        minHeight='100vh'
        // sx={{ bgcolor: 'background.default' }}
      >
        <Loading text='Sintonizando con el Aura...' size='lg' />
      </Box>
    )
  }

  if (!isAuthenticated) return <AuthPlaceholder />

  return (
    <HomeContainer>
      <Fade in={!authLoading} timeout={800}>
        <ContentWrapper>
          <MainColumn>
            {/* Header Orgánico Centrado */}
            <HomeHeader
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabsConfig={FEED_TABS_CONFIG}
            />

            <Stack>
              {/* Acciones Rápidas (Zen style) */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <CreatePostAction
                  onSave={handleCreatePost}
                  loading={isCreating}
                  replyToPost={replyToPost}
                  onCloseReply={() => setReplyToPost(null)}
                />
              </Box>

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

              {/* El Feed Infinito con Skeletons Zen */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10, y: 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -10, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
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
                </motion.div>
              </AnimatePresence>
            </Stack>
          </MainColumn>

          <SidebarContainer>
            <AuraSidebar />
          </SidebarContainer>
        </ContentWrapper>
      </Fade>
    </HomeContainer>
  )
}
export default Home
