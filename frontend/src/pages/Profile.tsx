import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper, Grid, Stack } from '@mui/material'

import { profileService } from '../services/profile.service'
import { User } from 'social-network-app-shared/types/auth.type'
import { useAuth } from '@/hooks/useAuth'
import { Post } from 'social-network-app-shared/types/social.type'
import { postService } from '@/services/post.service'
import { PostList } from '../components/social/post/PostList'
import { ProfileHeader } from '@/components/social/profile/ProfileHeader'
import { ProfileBio } from '@/components/social/profile/ProfileBio'
import { SuggestedUsers } from '@/components/social/profile/SuggestedUsers'
import { VisitorList } from '@/components/social/profile/VisitorList'
import { ProfileSkeleton } from '@/components/social/skeleton/ProfileSkeleton'
import { PostSkeleton } from '@/components/social/skeleton/PostSkeleton'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'

export const Profile = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()

  // Estados del perfil
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Estados de posts
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // --- NUEVO: ESTADO PARA RESPUESTAS ---
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const isOwnProfile = currentUser?.username === username

  // Resetear al cambiar de perfil
  useEffect(() => {
    setUserProfile(null)
    setPosts([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
  }, [username])

  // Carga de datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return
      try {
        const data = await profileService.getByUsername(username)
        setUserProfile(data)
        // Solo grabamos visita si no es nuestro propio perfil
        if (data.id && currentUser?.id !== data.id) {
          await profileService.recordVisit(data.id)
        }
      } catch (err: unknown) {
        console.error('Error al cargar perfil:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [username, currentUser?.id])

  // Carga de posts del usuario
  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return
      setLoadingPosts(true)
      try {
        const newPosts = await postService.getUserPosts(username, page)
        setPosts(prev => (page === 1 ? newPosts : [...prev, ...newPosts]))
        if (newPosts.length < 10) setHasMore(false)
      } catch (err) {
        console.error('Error al cargar posts:', err)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [username, page])

  // Handlers para interacciones
  const handleLike = async (postId: string) => {
    // Actualización optimista local
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
      // Actualizamos el contador de respuestas del post localmente
      setPosts(prev =>
        prev.map(p =>
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
    <>
      <Paper variant='outlined' sx={{ borderRadius: 0, overflow: 'hidden' }}>
        <ProfileHeader user={userProfile} isOwnProfile={isOwnProfile} />
        <ProfileBio user={userProfile} />
      </Paper>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Sección Principal de Posts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
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
                onLoadMore={() => setPage(prev => prev + 1)}
              />
            )}
          </Stack>
        </Grid>

        {/* Sección Lateral */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack
            spacing={3}
            sx={{
              position: 'sticky',
              top: 24,
              height: 'fit-content',
            }}
          >
            {isOwnProfile ? <VisitorList /> : <SuggestedUsers />}
          </Stack>
        </Grid>
      </Grid>

      {/* Acción de Respuesta (Diálogo) */}
      <CreatePostAction
        onSave={handleCreateReply}
        loading={isCreating}
        replyToPost={replyToPost}
        onCloseReply={() => setReplyToPost(null)}
      />
    </>
  )
}
