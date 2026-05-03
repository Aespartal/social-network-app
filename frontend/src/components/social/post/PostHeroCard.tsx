import { useState } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { Link } from 'react-router-dom'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
  alpha,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
import { useAuth } from '@/hooks'
import {
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  ChatBubbleOutline as CommentIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  IosShare as ShareIcon,
} from '@mui/icons-material'
import { ImageModal } from '@/components/common/ImageModal'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Piezas Atómicas
import { PostParentPreview } from './parts'

// Estilos
import { getPostHeroCardStyles } from './PostHeroCard.styles'

export interface PostHeroCardProps {
  post: Post
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onReply: (post: Post) => void
}

export const PostHeroCard = ({
  post,
  onLike,
  onBookmark,
  onReply,
}: PostHeroCardProps) => {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const theme = useTheme()
  const { isAuthenticated } = useAuth()

  const handleAction = (callback: (id: string) => void, id: string) => {
    if (!isAuthenticated) return
    callback(id)
  }

  const handleReplyAction = (post: Post) => {
    if (!isAuthenticated) return
    onReply(post)
  }

  const dateObject = new Date(post.createdAt)
  const formattedTime = format(dateObject, 'h:mm a', { locale: es })
  const formattedDate = format(dateObject, 'd MMM. yyyy', { locale: es })

  const getAuraEffect = () => {
    const impact = post.likesCount || 0
    if (impact === 0) return 'none'
    const intensity = Math.min(impact * 0.03, 0.15)
    const accentColor = '#E0FF4F'
    const hexIntensity = Math.floor(intensity * 255)
      .toString(16)
      .padStart(2, '0')
    return `radial-gradient(circle at bottom right, ${accentColor}${hexIntensity}, transparent 70%)`
  }

  const auraStyle = getAuraEffect()
  const styles = getPostHeroCardStyles(theme, auraStyle)

  return (
    <Box sx={styles.container}>
      {/* Contexto de respuesta si existe */}
      {post.parent && (
        <Box sx={{ mb: 2 }}>
          <PostParentPreview parent={post.parent} styles={styles} />
        </Box>
      )}

      <Box sx={styles.card}>
        {/* 0. Cabecera */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            #{post.tags?.[0]?.tag?.name || 'Reflexión'}
          </Box>
        </Box>

        {/* 1. Cuerpo */}
        <Typography sx={styles.content}>{post.content}</Typography>

        {/* 2. Media */}
        {post.image && (
          <Box
            onClick={() => setImageModalOpen(true)}
            sx={styles.mediaContainer}
          >
            <img src={post.image} alt='Post content' />
          </Box>
        )}

        {/* 3. Meta */}
        <Box sx={styles.meta}>
          <Typography variant='body2'>
            {formattedTime} · {formattedDate}
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              opacity: 0.5,
            }}
          />
          <Typography
            variant='body2'
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            Aura Detail
          </Typography>
        </Box>

        {/* 4. Pie */}
        <Box sx={styles.footer}>
          <Box
            component={Link}
            to={`/profile/${post.author?.username}`}
            sx={styles.authorInfo}
          >
            <OptimizedAvatar
              src={post.author?.avatar}
              alt={post.author?.name}
              size={32}
            />
            <Stack spacing={-0.5}>
              <Typography sx={styles.authorName}>
                {post.author?.name}
              </Typography>
              <Typography variant='caption' sx={{ opacity: 0.6 }}>
                @{post.author?.username}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ ...styles.actions, opacity: isAuthenticated ? 1 : 0.5 }}>
            <IconButton
              onClick={() => handleReplyAction(post)}
              sx={styles.actionIcon()}
              disabled={!isAuthenticated}
            >
              <CommentIcon />
            </IconButton>

            <IconButton
              onClick={() => handleAction(onLike, post.id)}
              sx={styles.actionIcon(
                post.isLiked ? theme.palette.error.main : undefined
              )}
              disabled={!isAuthenticated}
            >
              {post.isLiked ? <FavoriteFilledIcon /> : <FavoriteIcon />}
            </IconButton>

            <IconButton
              onClick={() => handleAction(onBookmark, post.id)}
              sx={styles.actionIcon(
                post.isBookmarked ? theme.palette.primary.main : undefined
              )}
              disabled={!isAuthenticated}
            >
              {post.isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
            </IconButton>

            <IconButton sx={styles.actionIcon()}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {post.image && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={post.image}
          altText='Visualización de Aura'
        />
      )}
    </Box>
  )
}
