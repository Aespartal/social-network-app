import { Post } from 'social-network-app-shared/types/social.type'
import { Link, useNavigate } from 'react-router-dom'

import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteFilledIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkFilledIcon from '@mui/icons-material/Bookmark'
import {
  Avatar,
  Box,
  CardActions,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Card, CardContent } from '@/components/ui'
import { formatTimeAgo } from '@/utils/date'

export interface PostCardProps {
  post: Post
  onLike: (postId: string) => Promise<void>
  onBookmark: (postId: string) => Promise<void>
  onReply: (post: Post) => void
  className?: string
  sx?: object
}

export const PostCard = ({
  post,
  onLike,
  onBookmark,
  onReply,
  className,
  sx,
}: PostCardProps) => {
  const navigate = useNavigate()

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return

    if (globalThis.location.pathname === `/post/${post.id}`) return

    navigate(`/post/${post.id}`)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Card
        variant='outlined'
        onClick={handleCardClick}
        className={className}
        sx={{ ...sx }}
      >
        <CardContent sx={{ pb: 0 }}>
          {/* 1. INDICADOR DE RESPUESTA */}
          {post.parentId && post.parent?.author && (
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ display: 'block', mb: 1, ml: 7 }}
            >
              Respondiendo a{' '}
              <Link
                to={`/profile/${post.parent.author.username}`}
                style={{ color: '#1d9bf0', textDecoration: 'none' }}
              >
                @{post.parent.author.username}
              </Link>
            </Typography>
          )}
          <Stack direction='row' spacing={2} alignItems='flex-start' mb={1.5}>
            <Avatar
              src={post.author?.avatar || ''}
              component={Link}
              to={`/profile/${post.author?.username}`}
              sx={{
                cursor: 'pointer',
                width: 40,
                height: 40,
                zIndex: 3,
                border: t => `2px solid ${t.palette.background.paper}`,
              }}
            />

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction='row' spacing={0.5} alignItems='center'>
                <Typography
                  variant='subtitle2'
                  component={Link}
                  to={`/profile/${post.author?.username}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {post.author?.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  @{post.author?.username}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  ·
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {' '}
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              </Stack>

              <Typography
                variant='body1'
                sx={{ mt: 0.5, wordBreak: 'break-word' }}
              >
                {post.content}
              </Typography>

              {/* RENDERIZADO DE IMAGEN SI EXISTE */}
              {post.image && (
                <Box
                  sx={{
                    mt: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'zoom-in',
                    maxWidth: '500px',
                    width: '100%',
                    transition: 'filter 0.2s ease-in-out',
                    '&:hover': {
                      filter: 'brightness(0.9)',
                    },
                  }}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <Box
                    component='img'
                    src={post.image}
                    alt='Contenido del post'
                    loading='lazy'
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '512px',
                      objectFit: 'cover',
                      display: 'block',
                      aspectRatio: post.image.includes('portrait')
                        ? '4/5'
                        : 'auto',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 1, justifyContent: 'space-between' }}>
          <Stack direction='row' spacing={2} alignItems='center'>
            {/* LIKES */}
            <Stack direction='row' alignItems='center'>
              <IconButton
                size='small'
                onClick={() => onLike(post.id)}
                color={post.isLiked ? 'error' : 'default'}
              >
                {post.isLiked ? (
                  <FavoriteFilledIcon fontSize='small' />
                ) : (
                  <FavoriteIcon fontSize='small' />
                )}
              </IconButton>
              <Typography variant='caption' color='text.secondary'>
                {post.likesCount}
              </Typography>
            </Stack>

            {/* RESPUESTAS */}
            <Stack direction='row' alignItems='center'>
              <IconButton size='small' onClick={() => onReply(post)}>
                <CommentIcon fontSize='small' />
              </IconButton>
              <Typography variant='caption' color='text.secondary'>
                {post.repliesCount}
              </Typography>
            </Stack>
          </Stack>

          {/* BOOKMARK */}
          <IconButton
            size='small'
            onClick={() => onBookmark(post.id)}
            color={post.isBookmarked ? 'primary' : 'default'}
          >
            {post.isBookmarked ? (
              <BookmarkFilledIcon fontSize='small' />
            ) : (
              <BookmarkIcon fontSize='small' />
            )}
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  )
}
