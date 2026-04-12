import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Fade,
  alpha,
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { PostHeader } from '@/components/social/post/PostHeader'
import { usePostDetail } from '@/hooks'
import { PostRepliesList } from '@/components/social/post/PostRepliesList'
import { PostHeroCard } from '@/components/social/post/PostHeroCard'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'
import { useTheme, useMediaQuery } from '@mui/material'

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {
    post,
    replies,
    loading,
    loadingMore,
    hasMore,
    loadMoreReplies,
    replyToPost,
    setReplyToPost,
    handleLike,
    handleBookmark,
    handleReply,
    handleSaveReply,
  } = usePostDetail(id)

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
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* COLUMNA PRINCIPAL */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            borderLeft: 'none', // El Nav ya tiene el borde de división
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            pb: 10,
          }}
        >
          {/* Header Sticky con efecto blur premium */}
          <Box
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              bgcolor: alpha(theme.palette.background.paper, 0.85),
              backdropFilter: 'blur(12px)',
              zIndex: 1100,
            }}
          >
            <PostHeader onNavigateBack={() => navigate(-1)} title='Post' />
          </Box>

          {/* SI EL POST ES UNA RESPUESTA, MOSTRAR EL PADRE ARRIBA */}
          {/* TODO: Implementar componente específico para mostrar ParentPost
          {post.parent && (
            <StyledPostCard
              post={post.parent}
              onLike={() => handleLike(post.parent!.id)}
              onBookmark={() => handleBookmark(post.parent!.id)}
              onReply={() => handleReply(post.parent!)}
              isThreadParent={true}
            />
          )}
          */}

          {/* EL POST DETALLADO (HERO) */}
          <PostHeroCard
            post={post}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onReply={handleReply}
          />

          {/* LISTA DE RESPUESTAS */}
          <PostRepliesList
            replies={replies}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onReply={handleReply}
          />

          {hasMore && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                onClick={loadMoreReplies}
                disabled={loadingMore}
                variant='text'
                size='small'
                sx={{ fontWeight: 600 }}
              >
                {loadingMore ? (
                  <CircularProgress size={16} />
                ) : (
                  'Mostrar más respuestas'
                )}
              </Button>
            </Box>
          )}

          {/* Action Button / Input */}
          <CreatePostAction
            onSave={handleSaveReply}
            loading={false}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />
        </Box>

        {/* COLUMNA LATERAL (Opcional en Detail, para consistencia) */}
        {!isMobile && (
          <Box
            sx={{
              width: '350px',
              p: 2,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <HomeSidebar />
          </Box>
        )}
      </Box>
    </Fade>
  )
}
