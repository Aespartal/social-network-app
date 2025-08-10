import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  Comment as CommentIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'
import type { Post, CreatePostRequest } from 'aplica-shared/types/social'

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [_page, _setPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)

  // Load feed on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadFeed()
    }
  }, [isAuthenticated])

  const loadFeed = async (reset = true) => {
    try {
      setLoading(true)
      const response = await postsAPI.getFeed({
        cursor: undefined,
        limit: 10,
      })

      if (reset) {
        setPosts(response.posts)
        _setPage(2)
      } else {
        setPosts(prev => [...prev, ...response.posts])
        _setPage((prev: number) => prev + 1)
      }

      setHasMorePosts(response.posts.length === 10)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el feed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      return
    }

    try {
      setIsCreatingPost(true)
      const postData: CreatePostRequest = {
        content: newPostContent.trim(),
      }

      const newPost = await postsAPI.createPost(postData)
      setPosts(prev => [newPost, ...prev])
      setNewPostContent('')
      setOpenCreateDialog(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleToggleLike = async (postId: string) => {
    try {
      await postsAPI.toggleLike(postId)
      // Reload feed to get updated data
      loadFeed()
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleToggleBookmark = async (postId: string) => {
    try {
      await postsAPI.toggleBookmark(postId)
      // Reload feed to get updated data
      loadFeed()
    } catch (err) {
      console.error('Error toggling bookmark:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) {
      return 'Ahora'
    }
    if (diffMins < 60) {
      return `${diffMins}m`
    }
    if (diffHours < 24) {
      return `${diffHours}h`
    }
    if (diffDays < 7) {
      return `${diffDays}d`
    }
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth='sm'>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          minHeight='80vh'
          textAlign='center'
        >
          <Typography variant='h4' gutterBottom>
            Bienvenido a Aplica Social
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            Inicia sesión o regístrate para ver tu feed personalizado
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='sm'>
      <Box py={2}>
        <Typography variant='h4' gutterBottom>
          Feed
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && posts.length === 0 ? (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {posts.map(post => {
              const userLiked = post.likes?.some(
                like => like.userId === user?.id
              )
              const userBookmarked = post.bookmarks?.some(
                bookmark => bookmark.userId === user?.id
              )

              return (
                <Card key={post.id}>
                  <CardContent>
                    <Box display='flex' alignItems='center' mb={2}>
                      <Avatar
                        src={post.author.avatar || undefined}
                        sx={{ mr: 2 }}
                      >
                        {post.author.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant='subtitle1' fontWeight='bold'>
                          {post.author.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          @{post.author.username} • {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                      <IconButton size='small'>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Typography variant='body1' paragraph>
                      {post.content}
                    </Typography>

                    {post.image && (
                      <Box
                        component='img'
                        src={post.image}
                        alt='Post image'
                        sx={{
                          width: '100%',
                          borderRadius: 1,
                          mb: 2,
                        }}
                      />
                    )}
                  </CardContent>

                  <CardActions>
                    <IconButton
                      onClick={() => handleToggleLike(post.id)}
                      color={userLiked ? 'error' : 'default'}
                    >
                      {userLiked ? <FavoriteFilledIcon /> : <FavoriteIcon />}
                    </IconButton>
                    <Typography variant='body2' color='text.secondary'>
                      {post._count?.likes || 0}
                    </Typography>

                    <IconButton>
                      <CommentIcon />
                    </IconButton>
                    <Typography variant='body2' color='text.secondary'>
                      {post._count?.comments || 0}
                    </Typography>

                    <Box flex={1} />

                    <IconButton
                      onClick={() => handleToggleBookmark(post.id)}
                      color={userBookmarked ? 'primary' : 'default'}
                    >
                      {userBookmarked ? (
                        <BookmarkFilledIcon />
                      ) : (
                        <BookmarkIcon />
                      )}
                    </IconButton>
                  </CardActions>
                </Card>
              )
            })}

            {hasMorePosts && (
              <Box display='flex' justifyContent='center' py={2}>
                <Button
                  onClick={() => loadFeed(false)}
                  disabled={loading}
                  variant='outlined'
                >
                  {loading ? <CircularProgress size={20} /> : 'Cargar más'}
                </Button>
              </Box>
            )}
          </Stack>
        )}

        {/* Create Post FAB */}
        <Fab
          color='primary'
          aria-label='Crear post'
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setOpenCreateDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Create Post Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>Crear nuevo post</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              placeholder='¿Qué está pasando?'
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              variant='outlined'
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCreateDialog(false)}
              disabled={isCreatingPost}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || isCreatingPost}
              variant='contained'
            >
              {isCreatingPost ? 'Publicando...' : 'Publicar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

export default Home
