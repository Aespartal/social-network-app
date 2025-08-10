import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import { CreatePost } from './CreatePost'
import { Post, PostData } from './Post'

// Mock data for demonstration
const mockUser = {
  name: 'Mi Usuario',
  username: 'mi_usuario',
  avatar: 'https://i.pravatar.cc/150?img=1',
}

const generateMockPosts = (count: number = 10): PostData[] => {
  const users = [
    {
      name: 'Ana García',
      username: 'ana_garcia',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      name: 'Carlos Ruiz',
      username: 'carlos_ruiz',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'María López',
      username: 'maria_lopez',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      name: 'Pedro Silva',
      username: 'pedro_silva',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Laura Moreno',
      username: 'laura_moreno',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
  ]

  const sampleContent = [
    '¡Que hermoso día para pasear por el parque! 🌞',
    'Acabo de terminar de leer un libro increíble. Muy recomendado 📚',
    'Preparando la cena familiar de hoy. ¿Alguna sugerencia? 👨‍🍳',
    'Reflexionando sobre este año que está terminando... ha sido intenso pero gratificante ✨',
    'Nueva playlist en Spotify! Perfecta para trabajar 🎵',
    'El atardecer de hoy está espectacular 🌅',
    'Empezando un nuevo proyecto. ¡Estoy muy emocionado!',
    'Café de la mañana ☕ Momento perfecto para planificar el día',
    'Weekend vibes! ¿Qué planes tienen para hoy? 🎉',
    'Compartiendo algunas fotos de mi último viaje 📸',
  ]

  const tags = [
    'vida',
    'trabajo',
    'música',
    'libros',
    'viajes',
    'comida',
    'familia',
    'amigos',
    'naturaleza',
    'tecnología',
  ]
  const images = [
    'https://picsum.photos/600/400?random=1',
    'https://picsum.photos/600/400?random=2',
    'https://picsum.photos/600/400?random=3',
    'https://picsum.photos/600/400?random=4',
    'https://picsum.photos/600/400?random=5',
  ]

  return Array.from({ length: count }, (_, index) => {
    const user = users[Math.floor(Math.random() * users.length)]
    const hasImage = Math.random() > 0.6
    const hasMultipleTags = Math.random() > 0.7
    const selectedTags = hasMultipleTags
      ? tags
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1)
      : Math.random() > 0.5
        ? [tags[Math.floor(Math.random() * tags.length)]]
        : []

    return {
      id: `post-${index + 1}`,
      author: user,
      content: sampleContent[Math.floor(Math.random() * sampleContent.length)],
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 15),
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8,
      image: hasImage
        ? images[Math.floor(Math.random() * images.length)]
        : undefined,
      tags: selectedTags,
    }
  }).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export interface FeedProps {
  className?: string
}

export const Feed: React.FC<FeedProps> = ({ className }) => {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        const initialPosts = generateMockPosts(10)
        setPosts(initialPosts)
      } catch (_err) {
        setError('Error al cargar las publicaciones')
      } finally {
        setLoading(false)
      }
    }

    loadInitialPosts()
  }, [])

  // Infinite scroll handler
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return
    }

    try {
      setLoadingMore(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      const morePosts = generateMockPosts(5)
      setPosts(prevPosts => [...prevPosts, ...morePosts])

      // Simulate no more posts after 30 posts
      if (posts.length >= 25) {
        setHasMore(false)
      }
    } catch (_err) {
      setError('Error al cargar más publicaciones')
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, posts.length])

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePosts])

  // Handle new post creation
  const handleCreatePost = async (
    content: string,
    image?: File,
    tags?: string[]
  ) => {
    try {
      const newPost: PostData = {
        id: `post-new-${Date.now()}`,
        author: mockUser,
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        image: image ? URL.createObjectURL(image) : undefined,
        tags: tags || [],
      }

      setPosts(prevPosts => [newPost, ...prevPosts])
    } catch (_err) {
      setError('Error al crear la publicación')
    }
  }

  // Handle post interactions
  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    )
  }

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isBookmarked: !post.isBookmarked,
            }
          : post
      )
    )
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
    // TODO: Implement comment functionality
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
    // TODO: Implement actual sharing functionality
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color='text.secondary'>
          Cargando publicaciones...
        </Typography>
      </Box>
    )
  }

  return (
    <Box className={className} sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
      {/* Header */}
      <Box sx={{ py: 3 }}>
        <Typography variant='h4' component='h1' fontWeight='bold'>
          Inicio
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Últimas publicaciones de tus amigos
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Create Post */}
      <CreatePost
        user={mockUser}
        onPost={handleCreatePost}
        placeholder='¿Qué quieres compartir con tus amigos?'
      />

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Posts Feed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
            onBookmark={() => handleBookmark(post.id)}
          />
        ))}
      </Box>

      {/* Load More Indicator */}
      {loadingMore && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
          }}
        >
          <CircularProgress size={30} />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 2 }}>
            Cargando más publicaciones...
          </Typography>
        </Box>
      )}

      {/* No More Posts */}
      {!hasMore && posts.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            No hay más publicaciones por mostrar
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <Typography variant='h6' color='text.secondary'>
            No hay publicaciones aún
          </Typography>
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            ¡Sé el primero en compartir algo con tus amigos!
          </Typography>
        </Box>
      )}
    </Box>
  )
}
