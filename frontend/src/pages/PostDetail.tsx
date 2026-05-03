import { useParams, useNavigate } from 'react-router-dom'
import { Box, Loading as Spinner, Text as Typography } from '@/components/ui'
import { Fade, alpha, useTheme } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { PostHeader } from '@/components/social/post/PostHeader'
import { usePostDetail, useAuth } from '@/hooks'
import { PostRepliesList } from '@/components/social/post/PostRepliesList'
import { PostHeroCard } from '@/components/social/post/PostHeroCard'

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const { isAuthenticated } = useAuth()
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
        minHeight='80vh'
      >
        <Spinner size='lg' />
        <Typography
          variant='caption'
          sx={{
            mt: 3,
            opacity: 0.6,
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
          }}
        >
          Sintonizando la profundidad...
        </Typography>
      </Box>
    )

  if (!post)
    return (
      <Box textAlign='center' py={15} px={2}>
        <ErrorOutlineIcon
          sx={{ fontSize: 64, color: 'text.disabled', mb: 3, opacity: 0.3 }}
        />
        <Typography variant='h4' sx={{ fontWeight: 800, mb: 1 }}>
          Este eco se ha desvanecido
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          mb={4}
          sx={{ maxWidth: 400, mx: 'auto' }}
        >
          El pensamiento que buscas ya no resuena en el lienzo. Es posible que
          haya sido eliminado por su autor.
        </Typography>
        <Box
          component='button'
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            border: 'none',
            px: 4,
            py: 1.5,
            borderRadius: '50px',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { transform: 'scale(1.05)' },
            transition: 'all 0.2s',
          }}
        >
          Regresar al Lienzo
        </Box>
      </Box>
    )

  return (
    <Fade in={!loading} timeout={800}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // bgcolor: 'background.default',
          width: '100%',
        }}
      >
        {/* 1. Header Zen (Flotante y transparente) */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            zIndex: 1100,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
            <PostHeader
              onNavigateBack={() => navigate(-1)}
              title='Respuestas'
              count={post.repliesCount}
            />
          </Box>
        </Box>

        {/* 2. Contenido Centralizado */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            position: 'relative',
            px: { xs: 2, sm: 4 },
            pt: 4,
            pb: 12,
          }}
        >
          {/* EL POST DETALLADO (HERO ZEN) */}
          <PostHeroCard
            post={post}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onReply={handleReply}
          />

          {/* LISTA DE RESPUESTAS (ECOS) */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant='h6'
              sx={{ mb: 3, fontWeight: 800, opacity: 0.8 }}
            >
              Ecos de este pensamiento
            </Typography>
            <PostRepliesList
              replies={replies}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onReply={handleReply}
            />
          </Box>

          {hasMore && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Box
                component='button'
                onClick={loadMoreReplies}
                disabled={loadingMore}
                sx={{
                  bgcolor: 'transparent',
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  px: 4,
                  py: 1,
                  borderRadius: '50px',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    color: 'primary.main',
                  },
                }}
              >
                {loadingMore ? 'Sincronizando ecos...' : 'Explorar más ecos'}
              </Box>
            </Box>
          )}
        </Box>

        {/* Action Modal (Aura Composer - Solo para autenticados) */}
        {isAuthenticated && (
          <CreatePostAction
            onSave={handleSaveReply}
            loading={false}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />
        )}
      </Box>
    </Fade>
  )
}

export default PostDetail
