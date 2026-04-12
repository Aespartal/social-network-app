import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Stack,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material'

import { profileService, postService, followService } from '@/services'
import { User } from 'social-network-app-shared/types/auth.type'
import { useAuth } from '@/hooks'
import { Post } from 'social-network-app-shared/types/social.type'
import { PostList } from '../components/social/post/PostList'
import { ProfileHeader } from '@/components/social/profile/ProfileHeader'
import { ProfileBio } from '@/components/social/profile/ProfileBio'
import { SuggestedUsers } from '@/components/social/profile/SuggestedUsers'
import { VisitorList } from '@/components/social/profile/VisitorList'
import { ProfileSkeleton } from '@/components/social/skeleton/ProfileSkeleton'
import { PostSkeleton } from '@/components/social/skeleton/PostSkeleton'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { EditProfileDialog } from '@/components/social/profile/EditProfileDialog'
import { UserList } from '@/components/social/profile/UserList'
import { Follower } from '@/services/follow.service'

export const Profile = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Ref para evitar llamadas duplicadas
  const visitRegisteredRef = useRef<string | null>(null)
  const profileLoadingRef = useRef(false)

  // Estados del perfil
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Estados de navegación
  const [activeTab, setActiveTab] = useState(0) // 0: Posts, 1: Followers, 2: Following

  // Estados de posts
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  // Estados de followers/following
  const [followers, setFollowers] = useState<Follower[]>([])
  const [following, setFollowing] = useState<Follower[]>([])
  const [loadingSocial, setLoadingSocial] = useState(false)

  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const isOwnProfile = useMemo(() => {
    if (!currentUser || !username) {
      return false
    }
    return currentUser.username === username
  }, [currentUser, username])

  const handleUpdateProfile = async (data: {
    username?: string
    name?: string
    bio?: string
    avatarFile?: File
  }) => {
    if (!userProfile) return

    setUpdating(true)
    try {
      const formData = new FormData()

      if (data.username) formData.append('username', data.username)
      if (data.name) formData.append('name', data.name)
      if (data.bio !== undefined) formData.append('bio', data.bio)
      if (data.avatarFile) formData.append('avatar', data.avatarFile)

      const updatedUser = await profileService.updateProfile(
        userProfile.id,
        formData
      )
      setUserProfile(updatedUser)

      if (currentUser?.id === userProfile.id) {
        globalThis.location.reload()
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      throw err
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    setUserProfile(null)
    setPosts([])
    setHasMore(true)
    setNextCursor(null)
    setLoading(true)
    setActiveTab(0)
    setFollowers([])
    setFollowing([])
    visitRegisteredRef.current = null
    profileLoadingRef.current = false
  }, [username])

  useEffect(() => {
    const loadProfile = async () => {
      if (!username || profileLoadingRef.current) return

      profileLoadingRef.current = true

      try {
        const data = await profileService.getByUsername(username)
        setUserProfile(data)

        // Solo registrar visita si no es tu propio perfil y no se ha registrado ya
        if (
          data.id &&
          currentUser?.id &&
          data.id !== currentUser.id &&
          visitRegisteredRef.current !== data.id
        ) {
          visitRegisteredRef.current = data.id
          await profileService.recordVisit(data.id)
        }
      } catch (err: unknown) {
        console.error('Error al cargar perfil:', err)
      } finally {
        setLoading(false)
        profileLoadingRef.current = false
      }
    }
    loadProfile()
  }, [username, currentUser?.id])

  // Carga de posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!username || activeTab !== 0) return
      setLoadingPosts(true)
      try {
        const response = await postService.getUserPosts(username, {
          limit: 10,
        })
        setPosts(response.posts ?? [])
        setNextCursor(response.meta?.nextCursor ?? null)
        setHasMore(response.meta?.hasMore ?? false)
      } catch (err) {
        console.error('Error al cargar posts:', err)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [username, activeTab])

  // Carga de followers/following
  useEffect(() => {
    const fetchSocial = async () => {
      if (!userProfile) return
      if (activeTab === 1) {
        setLoadingSocial(true)
        try {
          const data = await followService.getFollowers(userProfile.id)
          setFollowers(data)
        } catch (err) {
          console.error('Error al cargar seguidores:', err)
        } finally {
          setLoadingSocial(false)
        }
      } else if (activeTab === 2) {
        setLoadingSocial(true)
        try {
          const data = await followService.getFollowing(userProfile.id)
          setFollowing(data)
        } catch (err) {
          console.error('Error al cargar seguidos:', err)
        } finally {
          setLoadingSocial(false)
        }
      }
    }
    fetchSocial()
  }, [activeTab])

  // Función para cargar más posts
  const loadMorePosts = async () => {
    if (!username || !hasMore || loadingPosts || !nextCursor) return

    setLoadingPosts(true)
    try {
      const response = await postService.getUserPosts(username, {
        cursor: nextCursor,
        limit: 10,
      })

      setPosts(prev => [...prev, ...(response.posts ?? [])])
      setNextCursor(response.meta?.nextCursor ?? null)
      setHasMore(response.meta?.hasMore ?? false)
    } catch (err) {
      console.error('Error al cargar más posts:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleLike = async (postId: string) => {
    setPosts(prev =>
      prev.map((p: Post) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    )
    await postService.toggleLike(postId)
  }

  const handleBookmark = async (postId: string) => {
    setPosts(prev =>
      prev.map((p: Post) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    )
    await postService.toggleBookmark(postId)
  }

  const handleCreateReply = async (content: string) => {
    if (!replyToPost) return { success: false }
    setIsCreating(true)
    try {
      await postService.createPost({ content, parentId: replyToPost.id })
      setPosts(prev =>
        prev.map((p: Post) =>
          p.id === replyToPost.id
            ? { ...p, repliesCount: p.repliesCount + 1 }
            : p
        )
      )
      setReplyToPost(null)
      return { success: true }
    } catch (err: unknown) {
      console.error('Error al crear respuesta:', err)
      return { success: false }
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) return <ProfileSkeleton />

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* 1. SECCIÓN PRINCIPAL (Perfil) - Columna centrada */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          borderRight: '1px solid',
          borderColor: 'divider',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <Box sx={{ bgcolor: 'background.paper' }}>
          <ProfileHeader
            user={userProfile}
            isOwnProfile={isOwnProfile}
            onEditClick={() => setEditDialogOpen(true)}
          />
          <ProfileBio user={userProfile} />

          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant='fullWidth'
            indicatorColor='primary'
            textColor='primary'
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab label='Posts' />
            <Tab label='Seguidores' />
            <Tab label='Siguiendo' />
          </Tabs>
        </Box>

        {/* CONTENIDO DE TABS */}
        <Box>
          {activeTab === 0 && (
            <Box>
              {loadingPosts && posts.length === 0 ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                <PostList
                  posts={posts}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onReply={post => setReplyToPost(post)}
                  hasMore={hasMore}
                  loadingMore={loadingPosts}
                  onLoadMore={loadMorePosts}
                />
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {loadingSocial ? (
                <Box p={4} textAlign='center'>
                  Cargando seguidores...
                </Box>
              ) : (
                <UserList
                  users={followers}
                  emptyMessage='Este usuario aún no tiene seguidores.'
                />
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {loadingSocial ? (
                <Box p={4} textAlign='center'>
                  Cargando...
                </Box>
              ) : (
                <UserList
                  users={following}
                  emptyMessage='Este usuario no sigue a nadie todavía.'
                />
              )}
            </Box>
          )}
        </Box>

        {/* Dialog de edición de perfil */}
        {isOwnProfile && userProfile && (
          <EditProfileDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            user={userProfile}
            onSave={handleUpdateProfile}
            loading={updating}
          />
        )}
      </Box>

      {/* 2. SECCIÓN LATERAL (Sugerencias/Visitas) - Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: '350px',
            p: 2,
            display: { xs: 'none', lg: 'block' },
            flexShrink: 0,
          }}
        >
          <Stack
            spacing={3}
            sx={{
              position: 'sticky',
              top: 24,
              height: 'fit-content',
            }}
          >
            {isOwnProfile ? <VisitorList /> : <SuggestedUsers />}

            <Box sx={{ opacity: 0.6, px: 1 }}>
              <Typography variant='caption' display='block'>
                © 2026 SocialNet Pro
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Acción de Respuesta (Diálogo) */}
      <CreatePostAction
        onSave={handleCreateReply}
        loading={isCreating}
        replyToPost={replyToPost}
        onCloseReply={() => setReplyToPost(null)}
      />
    </Box>
  )
}
