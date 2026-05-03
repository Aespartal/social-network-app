import React, { useCallback } from 'react'
import { Box, Alert, Text as Typography, Loading, Stack } from '@/components/ui'
import { useTheme, Fade, LinearProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

// Hooks
import { useExplore, useAuth } from '@/hooks'
import { AuraSidebar } from '@/components/social/common/AuraSidebar'

// Componentes Sociales
import { PostList } from '@/components/social/post/PostList'
import { Post } from 'social-network-app-shared/types/social.type'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { HomeHeader } from '@/components/social/home/HomeHeader'

// Estilos Zen
import {
  ExploreContainer,
  DiscoveryMosaic,
  ContentWrapper,
  MainColumn,
  SidebarContainer,
} from './Explore.styles'

export const Explore: React.FC = () => {
  const theme = useTheme()
  const { isAuthenticated } = useAuth()
  const [replyToPost, setReplyToPost] = React.useState<Post | null>(null)
  const [activeTab, setActiveTab] = React.useState(0)

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

  // Configuración de tabs para Explore (pueden ser diferentes a Home)
  const EXPLORE_TABS = [
    { id: 0, label: 'Tendencias', type: 'trending' },
    { id: 1, label: 'Recientes', type: 'recent' },
  ] as const

  return (
    <ExploreContainer>
      <Fade in={true} timeout={800}>
        <ContentWrapper>
          <MainColumn>
            {/* Cabecera idéntica estructuralmente a Home */}
            <Box sx={{ position: 'relative' }}>
              <HomeHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabsConfig={EXPLORE_TABS}
              />
              {/* Indicador de carga integrado */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  zIndex: 5,
                }}
              >
                {loading && <LinearProgress sx={{ height: 2, opacity: 0.5 }} />}
              </Box>
            </Box>

            <Stack>
              {/* Mosaico Global de Descubrimiento */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <DiscoveryMosaic>
                    <Box sx={{ px: 2, mb: 4 }}>
                      <Typography
                        variant='h4'
                        sx={{
                          fontWeight: 800,
                          fontFamily: theme.typography.h1.fontFamily,
                          color: '#ffffff',
                        }}
                      >
                        Explorar el Lienzo
                      </Typography>
                    </Box>

                    {error && (
                      <Box sx={{ p: 4 }}>
                        <Alert severity='error' sx={{ borderRadius: '16px' }}>
                          {error}
                        </Alert>
                      </Box>
                    )}

                    {loading && posts.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          py: 10,
                        }}
                      >
                        <Loading size='lg' />
                      </Box>
                    ) : (
                      <PostList
                        posts={posts}
                        onLike={handleToggleLike}
                        onBookmark={handleToggleBookmark}
                        onReply={setReplyToPost}
                        hasMore={hasMorePosts}
                        loadingMore={loadingMore}
                        onLoadMore={handleLoadMore}
                      />
                    )}
                  </DiscoveryMosaic>
                </motion.div>
              </AnimatePresence>
            </Stack>
          </MainColumn>

          <SidebarContainer>
            <AuraSidebar />
          </SidebarContainer>
        </ContentWrapper>
      </Fade>

      {/* Acción de Respuesta (Solo para usuarios autenticados) */}
      {isAuthenticated && (
        <CreatePostAction
          onSave={handleCreatePost}
          loading={isCreating}
          replyToPost={replyToPost}
          onCloseReply={() => setReplyToPost(null)}
        />
      )}
    </ExploreContainer>
  )
}

export default Explore
