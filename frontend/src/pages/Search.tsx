import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Text as Typography,
  Stack,
  Alert,
  Avatar,
  Chip,
} from '@/components/ui'
import {
  useTheme,
  useMediaQuery,
  alpha,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { Verified as VerifiedIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// Hooks
import { useSearch } from '@/hooks/useSearch'

// Components
import { PostList } from '@/components/social/post/PostList'
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { SearchBar } from '@/components/social/home/SearchBar'

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const typeParam = searchParams.get('type') || 'all'
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(typeParam)

  const {
    posts,
    users,
    tags,
    loading,
    loadingMore,
    error,
    hasMore,
    search,
    handleToggleLike,
    handleToggleBookmark,
  } = useSearch()

  useEffect(() => {
    setActiveTab(typeParam)
  }, [typeParam])

  useEffect(() => {
    if (query) {
      search(query, true, activeTab as 'all' | 'posts' | 'users' | 'tags')
    }
  }, [query, activeTab, search])

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    setSearchParams({ q: query, type: newValue })
  }

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`)
  }

  const handleTagClick = (tag: string) => {
    navigate(`/posts/by-tag/${tag}`)
  }

  const renderContent = () => {
    if (loading && posts.length === 0 && users.length === 0) {
      return <FeedSkeleton />
    }

    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity='error' variant='outlined' sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        </Box>
      )
    }

    const hasPosts = posts.length > 0
    const hasUsers = users.length > 0
    const hasTags = tags.length > 0

    if (!hasPosts && !hasUsers && !hasTags) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={800} gutterBottom>
            No hay resultados para "{query}"
          </Typography>
          <Typography color='text.secondary'>
            Intenta buscar otra cosa o verifica que esté bien escrito.
          </Typography>
        </Box>
      )
    }

    return (
      <>
        {/* Posts */}
        {(activeTab === 'all' || activeTab === 'posts') && hasPosts && (
          <PostList
            posts={posts}
            onLike={handleToggleLike}
            onBookmark={handleToggleBookmark}
            hasMore={hasMore && activeTab === 'posts'}
            loadingMore={loadingMore}
            onLoadMore={() => search(query, false, 'posts')}
            onReply={() => {}}
          />
        )}

        {/* Users */}
        {(activeTab === 'all' || activeTab === 'users') && hasUsers && (
          <List sx={{ py: 2 }}>
            {users.map(user => (
              <ListItem
                key={user.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleUserClick(user.username)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar || undefined} alt={user.name}>
                    {user.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                      <Typography fontWeight={600}>{user.name}</Typography>
                      {user.verified && (
                        <VerifiedIcon color='primary' fontSize='small' />
                      )}
                    </Stack>
                  }
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Tags */}
        {(activeTab === 'all' || activeTab === 'tags') && hasTags && (
          <Box sx={{ p: 2 }}>
            <Stack direction='row' flexWrap='wrap' gap={1}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onClick={() => handleTagClick(tag)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </>
    )
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
          }}
        >
          <Box sx={{ p: 2 }}>
            {isMobile ? (
              <SearchBar initialValue={query} />
            ) : (
              <Typography variant='h6' fontWeight={800}>
                Resultados para "{query}"
              </Typography>
            )}
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab label='Todo' value='all' />
            <Tab label='Posts' value='posts' />
            <Tab label='Usuarios' value='users' />
            <Tab label='Tags' value='tags' />
          </Tabs>
        </Box>

        <Stack>{renderContent()}</Stack>
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
