import React, { useCallback } from 'react'
import { Box, Alert, Text as Typography, Loading, Stack } from '@/components/ui'
import { useTheme, Fade } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

// Hooks
import { useExplore } from '@/hooks'

// Componentes Sociales
import { PostList } from '@/components/social/post/PostList'
import { SuggestedUsers } from '@/components/social/profile/SuggestedUsers'
import { GlobalTrends } from '@/components/social/home/GlobalTrends'
import { Post } from 'social-network-app-shared/types/social.type'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { HomeHeader } from '@/components/social/home/HomeHeader'

// Estilos Zen
import {
  ExploreContainer,
  ResonanceGrid,
  ResonanceNode,
  DiscoveryMosaic,
  ContentWrapper,
  MainColumn,
  SidebarContainer,
} from './Explore.styles'

export const Explore: React.FC = () => {
  const theme = useTheme()
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

  // Datos mock para Nodos de Resonancia
  const resonanceThemes = [
    {
      tag: '#DiseñoÉtico',
      resonance: 'Alta',
      color: theme.palette.primary.main,
    },
    { tag: '#FilosofíaZen', resonance: 'En aumento', color: '#88B04B' },
    { tag: '#AuraMapping', resonance: 'Novedad', color: '#5F4B8B' },
    { tag: '#SlowReading', resonance: 'Constante', color: '#EFC050' },
    { tag: '#Biofílica', resonance: 'Muy Alta', color: '#92A8D1' },
  ]

  return (
    <ExploreContainer>
      <Fade in={true} timeout={800}>
        <ContentWrapper>
          <MainColumn>
            {/* Cabecera idéntica estructuralmente a Home */}
            <HomeHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabsConfig={EXPLORE_TABS}
            />

            <Stack>
              {/* 2. Mapa de Resonancia (Trending) */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ px: 4 }}>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 800,
                      fontFamily: theme.typography.h1.fontFamily,
                      color: '#ffffff',
                    }}
                  >
                    Resonando ahora
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ opacity: 0.7 }}
                  >
                    Temas que están expandiendo el lienzo colectivo.
                  </Typography>
                </Box>

                <ResonanceGrid>
                  {resonanceThemes.map(node => (
                    <ResonanceNode key={node.tag}>
                      <Typography
                        variant='h6'
                        sx={{ color: node.color, fontWeight: 700 }}
                      >
                        {node.tag}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          opacity: 0.6,
                        }}
                      >
                        Resonancia: {node.resonance}
                      </Typography>
                    </ResonanceNode>
                  ))}
                </ResonanceGrid>
              </Box>

              {/* 4. Mosaico Global de Descubrimiento */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
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
            <SuggestedUsers />
            <GlobalTrends />
          </SidebarContainer>
        </ContentWrapper>
      </Fade>

      {/* Acción de Respuesta */}
      <CreatePostAction
        onSave={handleCreatePost}
        loading={isCreating}
        replyToPost={replyToPost}
        onCloseReply={() => setReplyToPost(null)}
      />
    </ExploreContainer>
  )
}

export default Explore
