import { useState, memo } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'

import { Card, CardContent } from '@/components/ui'
import { ImageModal } from '@/components/common/ImageModal'
import { OptimizedImage } from '@/components/common/OptimizedImage'
import { OptimizedAvatar } from '@/components/common/OptimizedAvatar'
import { formatTimeAgo } from '@/utils/date'

// Sub-piezas
import { PostCardHeader } from './parts/PostCardHeader'
import { PostCardActions } from './parts/PostCardActions'
import { PostThreadLine } from './parts/PostThreadLine'

export interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onReply: (post: Post) => void
  isThreadParent?: boolean
  isThreadChild?: boolean
  className?: string
  sx?: object
}

export const PostCard = memo(
  ({
    post,
    onLike,
    onBookmark,
    onReply,
    isThreadParent = false,
    isThreadChild = false,
    className,
    sx,
  }: PostCardProps) => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [imageModalOpen, setImageModalOpen] = useState(false)

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
          sx={{
            ...sx,
            border: 'none',
            borderBottom: isThreadParent ? 'none' : '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{
              pb: 0,
              pt: isThreadChild ? 1 : 2,
              px: 0,
              '&:last-child': { pb: 0 },
            }}
          >
            {/* Layout Principal (Avatar | Contenido) */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 0 }}
            >
              {/* Carril de la línea de tiempo */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  px: 1,
                }}
              >
                <PostThreadLine
                  isThreadParent={isThreadParent}
                  isThreadChild={isThreadChild}
                />

                <Box
                  component={Link}
                  to={`/profile/${post.author?.username}`}
                  sx={{
                    zIndex: 3,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    borderRadius: '50%',
                  }}
                >
                  <OptimizedAvatar
                    src={post.author?.avatar}
                    alt={post.author?.name}
                    size='md'
                    lazy={true}
                    sx={{
                      border: theme =>
                        `2px solid ${theme.palette.background.paper}`,
                    }}
                  />
                </Box>
              </Box>

              {/* Columna de Contenido */}
              <Box sx={{ minWidth: 0, pr: 2 }}>
                {/* Contexto de respuesta - Post Padre */}
                {post.parentId && post.parent?.author && !isThreadChild && (
                  <Box
                    sx={{
                      mb: 1.5,
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <OptimizedAvatar
                        src={post.parent.author.avatar}
                        alt={post.parent.author.name}
                        size='xs'
                        lazy={true}
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

                <PostCardHeader post={post} />

                <Typography
                  variant='body1'
                  sx={{ mt: 0.5, wordBreak: 'break-word' }}
                >
                  {post.content}
                </Typography>

                {post.image && (
                  <OptimizedImage
                    src={post.image}
                    alt='Post content'
                    onClick={e => {
                      e.stopPropagation()
                      setImageModalOpen(true)
                    }}
                    maxHeight='512px'
                    aspectRatio={
                      post.image.includes('portrait') ? '4/5' : undefined
                    }
                    sx={{
                      mt: 1.5,
                      borderRadius: theme.tokens.borderRadius.md,
                      border: (t: { palette: { divider: string } }) =>
                        `1px solid ${t.palette.divider}`,
                    }}
                  />
                )}

                <PostCardActions
                  post={post}
                  onLike={onLike}
                  onBookmark={onBookmark}
                  onReply={onReply}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

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
)
