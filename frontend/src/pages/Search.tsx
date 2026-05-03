import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  LinearProgress,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { Verified as VerifiedIcon } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

// Hooks
import { useSearch } from '@/hooks'

// Components
import { PostList } from '@/components/social/post/PostList'
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { AuraSidebar } from '@/components/social/common/AuraSidebar'
import { SearchBar } from '@/components/social/home/SearchBar'

// Estilos
import {
  SearchContainer,
  ContentWrapper,
  MainColumn,
  SidebarContainer,
  StickyHeader,
  FeedSelectorContainer,
  FeedSelectorItem,
  AuraDot,
} from './Search.styles'

const SEARCH_TABS = [
  { id: 'all', label: 'Todo' },
  { id: 'posts', label: 'Posts' },
  { id: 'users', label: 'Usuarios' },
  { id: 'tags', label: 'Tags' },
] as const

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const typeParam = searchParams.get('type') || 'all'
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(typeParam)
  const lastQueryRef = React.useRef(query)

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
      const isNewQuery = query !== lastQueryRef.current
      search(
        query,
        true,
        activeTab as 'all' | 'posts' | 'users' | 'tags',
        isNewQuery
      )
      lastQueryRef.current = query
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
    if (
      loading &&
      posts.length === 0 &&
      users.length === 0 &&
      tags.length === 0
    ) {
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
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
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
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <SearchContainer>
      <ContentWrapper>
        {/* 1. COLUMNA PRINCIPAL */}
        <MainColumn>
          {/* Header de Búsqueda */}
          <StickyHeader>
            <Box sx={{ px: 2 }}>
              {isMobile ? (
                <SearchBar initialValue={query} />
              ) : (
                <Typography variant='h6' fontWeight={800}>
                  Resultados para "{query}"
                </Typography>
              )}
            </Box>

            {/* Tabs Orgánicos */}
            <Box
              sx={{ mt: 1, px: 2, display: 'flex', justifyContent: 'center' }}
            >
              <FeedSelectorContainer>
                {SEARCH_TABS.map(tab => {
                  const isActive = activeTab === tab.id
                  return (
                    <FeedSelectorItem
                      key={tab.id}
                      active={isActive}
                      onClick={() => handleTabChange(null as any, tab.id)}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <AuraDot
                          layoutId='searchTab'
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </FeedSelectorItem>
                  )
                })}
              </FeedSelectorContainer>
            </Box>

            {/* Indicador de carga integrado al final del header */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
              }}
            >
              {loading && <LinearProgress sx={{ height: 2, opacity: 0.5 }} />}
            </Box>
          </StickyHeader>

          <Stack sx={{ position: 'relative' }}>{renderContent()}</Stack>
        </MainColumn>

        {/* 2. COLUMNA LATERAL */}
        <SidebarContainer>
          <AuraSidebar />
        </SidebarContainer>
      </ContentWrapper>
    </SearchContainer>
  )
}

export default Search
