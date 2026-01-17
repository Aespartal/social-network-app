import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Stack,
  CircularProgress,
  Typography,
  Button,
  Container,
  Fade,
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { PostHeader } from '@/components/social/post/PostHeader'
import { usePostDetail } from '@/hooks'
import { PostRepliesList } from '@/components/social/post/PostRepliesList'
import { StyledPostCard } from '@/components/social/post/PostCard.styles'

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    post,
    loading,
    replyToPost,
    setReplyToPost,
    handleLike,
    handleBookmark,
    handleReply,
    handleSaveReply,
  } = usePostDetail(id)

  // Estado de carga más limpio
  if (loading)
    return (
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='60vh'
      >
        <CircularProgress size={30} thickness={4} />
        <Typography variant='caption' sx={{ mt: 2, color: 'text.secondary' }}>
          Cargando conversación...
        </Typography>
      </Box>
    )

  // Estado de error mejorado
  if (!post)
    return (
      <Box textAlign='center' py={10} px={2}>
        <ErrorOutlineIcon
          sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
        />
        <Typography variant='h6'>Este post no está disponible</Typography>
        <Typography color='text.secondary' mb={3}>
          Es posible que haya sido eliminado.
        </Typography>
        <Button variant='contained' onClick={() => navigate(-1)}>
          Volver atrás
        </Button>
      </Box>
    )

  return (
    <Fade in={!loading}>
      <Box sx={{ pb: 10 }}>
        {' '}
        {/* Padding bottom para que el CreatePostAction no tape nada */}
        {/* Header Sticky */}
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <PostHeader onNavigateBack={() => navigate(-1)} title='Post' />
        </Box>
        <Container maxWidth='lg' disableGutters>
          <Stack spacing={1}>
            {/* EL PROTAGONISTA */}
            <StyledPostCard
              post={post}
              onLike={() => handleLike(post.id)}
              onBookmark={() => handleBookmark(post.id)}
              onReply={() => handleReply(post)}
              sx={{
                '& .MuiTypography-body1': {
                  fontSize: '1.25rem',
                  lineHeight: 1.4,
                  py: 1,
                },
              }}
            />

            <PostRepliesList
              replies={post.replies || []}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onReply={handleReply}
            />
          </Stack>
        </Container>
        {/* Action Button / Input */}
        <CreatePostAction
          onSave={handleSaveReply}
          loading={false}
          replyToPost={replyToPost}
          onCloseReply={() => setReplyToPost(null)}
        />
      </Box>
    </Fade>
  )
}
