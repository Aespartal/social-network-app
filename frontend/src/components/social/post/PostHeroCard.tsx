import { useState } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteFilledIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkFilledIcon from '@mui/icons-material/Bookmark'
import IosShareIcon from '@mui/icons-material/IosShare'
import { ImageModal } from '@/components/common/ImageModal'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatTimeAgo } from '@/utils/date'

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
  const navigate = useNavigate()
  const theme = useTheme()

  const dateObject = new Date(post.createdAt)
  const formattedTime = format(dateObject, 'h:mm a', { locale: es })
  const formattedDate = format(dateObject, 'd MMM. yyyy', { locale: es })

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      {/* Contexto de respuesta - Post Padre */}
      {post.parent && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: theme.tokens.borderRadius.sm,
            bgcolor: 'action.hover',
            cursor: 'pointer',
            transition: `all ${theme.tokens.transition.normal}`,
            '&:hover': {
              bgcolor: 'action.selected',
              borderColor: 'primary.main',
            },
          }}
          onClick={e => {
            e.stopPropagation()
            navigate(`/post/${post.parent!.id}`)
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <OptimizedAvatar
              src={post.parent.author.avatar}
              alt={post.parent.author.name}
              size='xs'
            />
            <Typography
              variant='caption'
              fontWeight='bold'
              color='text.primary'
            >
              {post.parent.author.name}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              @{post.parent.author.username}
            </Typography>
            {post.parent.createdAt && (
              <>
                <Typography variant='caption' color='text.secondary'>
                  ·
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {formatTimeAgo(post.parent.createdAt)}
                </Typography>
              </>
            )}
          </Box>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {post.parent.content}
          </Typography>
        </Box>
      )}

      {/* 1. Header: Avatar + User Info */}
      <Stack direction='row' spacing={1.5} alignItems='center' mb={2}>
        <OptimizedAvatar
          src={post.author?.avatar}
          alt={post.author?.name}
          size='lg'
        />
        <Stack spacing={0}>
          <Typography
            variant='subtitle1'
            component={Link}
            to={`/profile/${post.author?.username}`}
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              textDecoration: 'none',
              lineHeight: 1.2,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {post.author?.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            @{post.author?.username}
          </Typography>
        </Stack>
      </Stack>

      {/* 2. Content - Larger and crisp */}
      <Typography
        sx={{
          fontSize: '1.45rem',
          lineHeight: 1.3,
          fontWeight: 400,
          color: 'text.primary',
          mb: 2,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          letterSpacing: '-0.01em',
        }}
      >
        {post.content}
      </Typography>

      {/* 3. Media - Modern rounded corners */}
      {post.image && (
        <Box
          onClick={() => setImageModalOpen(true)}
          sx={{
            mb: 2,
            borderRadius: theme.tokens.borderRadius.lg,
            overflow: 'hidden',
            border: t => `1px solid ${alpha(t.palette.divider, 0.1)}`,
            cursor: 'pointer',
            transition: `opacity ${theme.tokens.transition.normal}`,
            '&:hover': { opacity: 0.98 },
          }}
        >
          <img
            src={post.image}
            alt='Post content'
            style={{ width: '100%', display: 'block' }}
          />
        </Box>
      )}

      {/* 4. Timestamp & Source - Very subtle */}
      <Stack direction='row' spacing={1} sx={{ mb: 1.5, opacity: 0.7 }}>
        <Typography variant='body2' color='text.secondary'>
          {formattedTime}
        </Typography>
        <span>·</span>
        <Typography variant='body2' color='text.secondary'>
          {formattedDate}
        </Typography>
        <span>·</span>
        <Typography variant='body2' color='primary' sx={{ fontWeight: 600 }}>
          SocialNet Pro
        </Typography>
      </Stack>

      {/* 5. Stats Section - Only if metrics exist */}
      {(post.likesCount > 0 ||
        post.repliesCount > 0 ||
        post.bookmarksCount > 0) && (
        <Box
          sx={{
            py: 1.5,
            px: 0.5,
            borderTop: t => `1px solid ${alpha(t.palette.divider, 0.15)}`,
          }}
        >
          <Stack direction='row' spacing={3}>
            {post.repliesCount > 0 && (
              <Stack direction='row' spacing={0.5} alignItems='baseline'>
                <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                  {post.repliesCount}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: '0.9rem' }}
                >
                  Respuestas
                </Typography>
              </Stack>
            )}
            {post.likesCount > 0 && (
              <Stack direction='row' spacing={0.5} alignItems='baseline'>
                <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                  {post.likesCount}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: '0.9rem' }}
                >
                  Me gusta
                </Typography>
              </Stack>
            )}
            {post.bookmarksCount > 0 && (
              <Stack direction='row' spacing={0.5} alignItems='baseline'>
                <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                  {post.bookmarksCount}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: '0.9rem' }}
                >
                  Guardados
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      )}

      {/* 6. Actions Section - High performance design */}
      <Box
        sx={{
          py: 0.25,
          borderTop: t => `1px solid ${alpha(t.palette.divider, 0.15)}`,
          borderBottom: t => `1px solid ${alpha(t.palette.divider, 0.15)}`,
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-around'
          alignItems='center'
        >
          <IconButton
            onClick={() => onReply(post)}
            sx={{
              color: 'text.secondary',
              p: 1.25,
              transition: '0.2s',
              '&:hover': {
                color: 'primary.main',
                bgcolor: t => alpha(t.palette.primary.main, 0.1),
              },
            }}
          >
            <CommentIcon sx={{ fontSize: '1.4rem' }} />
          </IconButton>
          <IconButton
            onClick={() => onLike(post.id)}
            sx={{
              color: post.isLiked ? 'error.main' : 'text.secondary',
              p: 1.25,
              transition: '0.2s',
              '&:hover': {
                color: 'error.main',
                bgcolor: t => alpha(t.palette.error.main, 0.1),
              },
            }}
          >
            {post.isLiked ? (
              <FavoriteFilledIcon sx={{ fontSize: '1.4rem' }} />
            ) : (
              <FavoriteIcon sx={{ fontSize: '1.4rem' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => onBookmark(post.id)}
            sx={{
              color: post.isBookmarked ? 'primary.main' : 'text.secondary',
              p: 1.25,
              transition: '0.2s',
              '&:hover': {
                color: 'primary.main',
                bgcolor: t => alpha(t.palette.primary.main, 0.1),
              },
            }}
          >
            {post.isBookmarked ? (
              <BookmarkFilledIcon sx={{ fontSize: '1.4rem' }} />
            ) : (
              <BookmarkIcon sx={{ fontSize: '1.4rem' }} />
            )}
          </IconButton>
          <IconButton
            sx={{
              color: 'text.secondary',
              p: 1.25,
              transition: '0.2s',
              '&:hover': {
                color: 'primary.main',
                bgcolor: t => alpha(t.palette.primary.main, 0.1),
              },
            }}
          >
            <IosShareIcon sx={{ fontSize: '1.4rem' }} />
          </IconButton>
        </Stack>
      </Box>

      {post.image && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={post.image}
          altText='Imagen del post'
        />
      )}
    </Box>
  )
}
