import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, CircularProgress, Alert, Fab, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar,
  Card, CardContent, CardActions, IconButton, Stack, Skeleton
} from '@mui/material';
import {
  Add as AddIcon, FavoriteBorder as FavoriteIcon, Favorite as FavoriteFilledIcon,
  BookmarkBorder as BookmarkIcon, Bookmark as BookmarkFilledIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { postsAPI } from '@/services/api';
import type { Post } from 'social-network-app-shared/types/social';

// --- Subcomponente de Skeleton para mejor UX ---
const PostSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box flex={1}><Skeleton width="40%" /><Skeleton width="20%" /></Box>
      </Box>
      <Skeleton variant="rectangular" height={100} />
    </CardContent>
  </Card>
);

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const loadFeed = useCallback(async (isInitial = true) => {
    try {
      isInitial ? setLoading(true) : setLoadingMore(true);
      
      // Usamos el ID del último post como cursor para paginación real
      const cursor = !isInitial && posts.length > 0 ? posts[posts.length - 1].id : undefined;
      
      const response = await postsAPI.getFeed({
        cursor,
        limit: 10,
      });

      const newPosts = response.posts;
      setPosts(prev => isInitial ? newPosts : [...prev, ...newPosts]);
      setHasMorePosts(newPosts.length === 10);
    } catch (err: any) {
      setError('No pudimos cargar las publicaciones. Reintenta más tarde.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [posts]);

  useEffect(() => {
    if (isAuthenticated) loadFeed(true);
  }, [isAuthenticated]);

  // --- Lógica Optimista para Likes ---
  const handleToggleLike = async (postId: string) => {
    // 1. Actualización inmediata en UI
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));

    try {
      await postsAPI.toggleLike(postId);
    } catch (err) {
      // 2. Si falla, revertimos el cambio (Rollback)
      loadFeed(true); 
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      setIsCreatingPost(true);
      const newPost = await postsAPI.createPost({ content: newPostContent.trim() });
      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setOpenCreateDialog(false);
    } catch (err: any) {
      setError('Error al publicar. Inténtalo de nuevo.');
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (!isAuthenticated) return <AuthPlaceholder />;

  return (
    <Container maxWidth="sm">
      <Box py={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Tu Feed</Typography>

        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2}>
          {loading && posts.length === 0 ? (
            [1, 2, 3].map(i => <PostSkeleton key={i} />)
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={() => handleToggleLike(post.id)}
                onBookmark={() => postsAPI.toggleBookmark(post.id)} // Implementar optimismo igual que Like
              />
            ))
          )}

          {hasMorePosts && (
            <Box textAlign="center" py={2}>
              <Button 
                onClick={() => loadFeed(false)} 
                disabled={loadingMore}
                variant="text"
              >
                {loadingMore ? <CircularProgress size={24} /> : 'Ver más publicaciones'}
              </Button>
            </Box>
          )}
        </Stack>

        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 20, right: 20 }} 
          onClick={() => setOpenCreateDialog(true)}
        >
          <AddIcon />
        </Fab>

        <CreatePostDialog 
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          content={newPostContent}
          setContent={setNewPostContent}
          onSave={handleCreatePost}
          loading={isCreatingPost}
        />
      </Box>
    </Container>
  );
};

// --- Componentes de Apoyo Extraídos para Limpieza ---

const PostCard = ({ post, onLike, onBookmark }: { post: Post, onLike: any, onBookmark: any }) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
        <Avatar src={post.author.avatar || ''} />
        <Box>
          <Typography variant="subtitle2" lineHeight={1}>{post.author.name}</Typography>
          <Typography variant="caption" color="text.secondary">@{post.author.username}</Typography>
        </Box>
      </Stack>
      <Typography variant="body1">{post.content}</Typography>
    </CardContent>
    <CardActions sx={{ px: 2, pb: 1, justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" onClick={onLike} color={post.isLiked ? 'error' : 'default'}>
          {post.isLiked ? <FavoriteFilledIcon /> : <FavoriteIcon />}
        </IconButton>
        <Typography variant="caption">{post.likesCount}</Typography>
        
        <IconButton size="small"><CommentIcon fontSize="small" /></IconButton>
        <Typography variant="caption">{post.commentsCount}</Typography>
      </Stack>
      <IconButton size="small" onClick={onBookmark} color={post.isBookmarked ? 'primary' : 'default'}>
        {post.isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
      </IconButton>
    </CardActions>
  </Card>
);

const CreatePostDialog = ({ open, onClose, content, setContent, onSave, loading }: any) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>¿Qué quieres compartir?</DialogTitle>
    <DialogContent>
      <TextField 
        fullWidth multiline rows={3} variant="filled"
        placeholder="Escribe aquí..." value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cerrar</Button>
      <Button onClick={onSave} variant="contained" disabled={loading || !content.trim()}>
        {loading ? 'Publicando...' : 'Postear'}
      </Button>
    </DialogActions>
  </Dialog>
);

const AuthPlaceholder = () => (
  <Box textAlign="center" py={10}>
    <Typography variant="h4">Social Network</Typography>
    <Typography color="text.secondary">Conéctate para ver qué está pasando.</Typography>
  </Box>
);

export default Home;