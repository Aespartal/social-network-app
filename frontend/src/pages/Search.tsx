import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Alert,
} from '@mui/material'

// Hooks
import { useSearch } from '@/hooks/useSearch'

// Components
import { PostList } from '@/components/social/post/PostList'
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { SearchBar } from '@/components/social/home/SearchBar'

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    search,
    handleToggleLike,
    handleToggleBookmark,
  } = useSearch()

  useEffect(() => {
    if (query) {
      search(query, true)
    }
  }, [query, search])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      search(query, false)
    }
  }

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
        {/* Header de Búsqueda */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
          }}
        >
          {isMobile ? (
            <SearchBar initialValue={query} />
          ) : (
            <Typography variant='h6' fontWeight={800}>
              Resultados para "{query}"
            </Typography>
          )}
        </Box>

        <Stack>
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
          ) : posts.length === 0 && !loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='h5' fontWeight={800} gutterBottom>
                No hay resultados para "{query}"
              </Typography>
              <Typography color='text.secondary'>
                Intenta buscar otra cosa o verifica que esté bien escrito.
              </Typography>
            </Box>
          ) : (
            <PostList
              posts={posts}
              onLike={handleToggleLike}
              onBookmark={handleToggleBookmark}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMore}
              onReply={() => {}}
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

export default Search
