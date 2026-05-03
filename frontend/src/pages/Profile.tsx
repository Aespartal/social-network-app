import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stack,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material'

import { Loading } from '@/components/ui'

import { profileService, postService, followService } from '@/services'
import { User } from 'social-network-app-shared/types/auth.type'
import { useAuth } from '@/hooks'
import { Post } from 'social-network-app-shared/types/social.type'
import { PostList } from '../components/social/post/PostList'
import { ProfileHeader } from '@/components/social/profile/ProfileHeader'
import { ProfileBio } from '@/components/social/profile/ProfileBio'
import { ProfileAchievements } from '@/components/social/profile/ProfileAchievements'
import { PostSkeleton } from '@/components/social/skeleton/PostSkeleton'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { EditProfileDialog } from '@/components/social/profile/EditProfileDialog'
import { UserList } from '@/components/social/profile/UserList'
import { Follower } from '@/services/follow.service'

// Estilos Zen
import {
  ProfileContainer,
  ProfileMainColumn,
  ProfileContentWrapper,
  ProfileTabContainer,
} from './Profile.styles'

export const Profile = () => {
  const { username, section } = useParams<{
    username: string
    section?: string
  }>()
  const navigate = useNavigate()
  const { user: currentUser, updateUser } = useAuth()
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

  // 0: Posts, 1: Followers, 2: Following, 3: Logros
  const activeTab = useMemo(() => {
    const sections = ['posts', 'followers', 'following', 'achievements']
    if (!section) return 0
    const index = sections.indexOf(section)
    if (index === 3 && username !== currentUser?.username) {
      return 0
    }
    return index === -1 ? 0 : index
  }, [section, username, currentUser?.username])

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
        updateUser(updatedUser)
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
        if (
          data.id &&
          currentUser?.id &&
          data.id !== currentUser.id &&
          visitRegisteredRef.current !== data.id
        ) {
          visitRegisteredRef.current = data.id
          await profileService.recordVisit(data.id)
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err)
      } finally {
        setLoading(false)
        profileLoadingRef.current = false
      }
    }
    loadProfile()
  }, [username, currentUser?.id])

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username || activeTab !== 0) return
      setLoadingPosts(true)
      try {
        const response = await postService.getUserPosts(username, { limit: 12 })
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

  useEffect(() => {
    const fetchSocial = async () => {
      if (!userProfile) return
      if (activeTab === 1 || activeTab === 2) {
        setLoadingSocial(true)
        try {
          if (activeTab === 1) {
            const data = await followService.getFollowers(userProfile.id)
            setFollowers(data)
          } else {
            const data = await followService.getFollowing(userProfile.id)
            setFollowing(data)
          }
        } catch (err) {
          console.error('Error al cargar datos sociales:', err)
        } finally {
          setLoadingSocial(false)
        }
      }
    }
    fetchSocial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userProfile?.id])

  const loadMorePosts = async () => {
    if (!username || !hasMore || loadingPosts || !nextCursor) return
    setLoadingPosts(true)
    try {
      const response = await postService.getUserPosts(username, {
        cursor: nextCursor,
        limit: 12,
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
      prev.map(p =>
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
      prev.map(p =>
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
        prev.map(p =>
          p.id === replyToPost.id
            ? { ...p, repliesCount: p.repliesCount + 1 }
            : p
        )
      )
      setReplyToPost(null)
      return { success: true }
    } catch (err) {
      console.error('Error al crear respuesta:', err)
      return { success: false }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Fade in={!loading} timeout={800}>
      <ProfileContainer>
        <ProfileMainColumn>
          {/* Cabecera y Bio Zen */}
          <ProfileHeader
            user={userProfile}
            isOwnProfile={isOwnProfile}
            onEditClick={() => setEditDialogOpen(true)}
          />
          <ProfileBio user={userProfile} />

          {/* Sistema de Navegación Zen */}
          <ProfileTabContainer>
            <ProfileContentWrapper>
              <Tabs
                value={activeTab}
                onChange={(_, val) => {
                  const sections = [
                    'posts',
                    'followers',
                    'following',
                    'achievements',
                  ]
                  const newSection = sections[val]
                  navigate(
                    newSection === 'posts'
                      ? `/profile/${username}`
                      : `/profile/${username}/${newSection}`
                  )
                }}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons={isMobile ? 'auto' : false}
                indicatorColor='primary'
                textColor='primary'
                centered={!isMobile}
              >
                <Tab label='Lienzo de Posts' />
                <Tab label='Conexiones' />
                <Tab label='Afinidad' />
                {isOwnProfile && <Tab label='Evolución (Logros)' />}
              </Tabs>
            </ProfileContentWrapper>
          </ProfileTabContainer>

          {/* Contenido Dinámico con Animación Zen */}
          <ProfileContentWrapper sx={{ py: 4, minHeight: '400px' }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1], // Zen ease-out
                }}
              >
                {activeTab === 0 && (
                  <Box>
                    {loadingPosts && posts.length === 0 ? (
                      <Stack spacing={2}>
                        <PostSkeleton />
                        <PostSkeleton />
                      </Stack>
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

                {(activeTab === 1 || activeTab === 2) && (
                  <Box>
                    {loadingSocial ? (
                      <Box p={4} display='flex' justifyContent='center'>
                        <Loading text='Sintonizando la afinidad...' />
                      </Box>
                    ) : (
                      <UserList
                        users={activeTab === 1 ? followers : following}
                        emptyMessage={
                          activeTab === 1
                            ? 'Sin conexiones todavía.'
                            : 'Sin afinidades todavía.'
                        }
                      />
                    )}
                  </Box>
                )}

                {activeTab === 3 && isOwnProfile && (
                  <Box sx={{ p: 2 }}>
                    <ProfileAchievements userId={userProfile?.id} />
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </ProfileContentWrapper>

          {/* Diálogos */}
          {isOwnProfile && userProfile && (
            <EditProfileDialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              user={userProfile}
              onSave={handleUpdateProfile}
              loading={updating}
            />
          )}
          <CreatePostAction
            onSave={handleCreateReply}
            loading={isCreating}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />
        </ProfileMainColumn>
      </ProfileContainer>
    </Fade>
  )
}

export default Profile
