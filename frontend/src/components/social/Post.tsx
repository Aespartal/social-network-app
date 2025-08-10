import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material'
import { Card, CardContent, Button } from '@/components/ui'

export interface PostData {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
  tags?: string[]
}

export interface PostProps {
  post: PostData
  onLike: (postId: string) => void
  onComment: (postId: string) => void
  onShare: (postId: string) => void
  onBookmark: (postId: string) => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
}

export const Post: React.FC<PostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

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
    return date.toLocaleDateString()
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Card sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1 }}>
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='subtitle1' fontWeight='bold'>
              {post.author.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              @{post.author.username} • {formatTimestamp(post.timestamp)}
            </Typography>
          </Box>
          <IconButton onClick={handleMenuOpen} size='small'>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {onEdit && (
              <MenuItem
                onClick={() => {
                  onEdit(post.id)
                  handleMenuClose()
                }}
              >
                Editar
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem
                onClick={() => {
                  onDelete(post.id)
                  handleMenuClose()
                }}
              >
                Eliminar
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClose}>Reportar</MenuItem>
            <MenuItem onClick={handleMenuClose}>Ocultar</MenuItem>
          </Menu>
        </Box>

        {/* Content */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant='body1' sx={{ mb: 1, lineHeight: 1.5 }}>
            {showFullContent ? post.content : truncateContent(post.content)}
            {post.content.length > 200 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowFullContent(!showFullContent)}
                sx={{ ml: 1, p: 0, minWidth: 'auto', fontSize: '0.875rem' }}
              >
                {showFullContent ? 'Ver menos' : 'Ver más'}
              </Button>
            )}
          </Typography>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size='small'
                  variant='outlined'
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Image */}
        {post.image && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Box
              component='img'
              src={post.image}
              alt='Post content'
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            />
          </Box>
        )}

        <Divider />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={() => onLike(post.id)}
              color={post.isLiked ? 'error' : 'default'}
              size='small'
            >
              {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant='body2' color='text.secondary'>
              {post.likes}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
            <IconButton onClick={() => onComment(post.id)} size='small'>
              <CommentIcon />
            </IconButton>
            <Typography variant='body2' color='text.secondary'>
              {post.comments}
            </Typography>
          </Box>

          <IconButton
            onClick={() => onShare(post.id)}
            size='small'
            sx={{ ml: 2 }}
          >
            <ShareIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={() => onBookmark(post.id)}
            color={post.isBookmarked ? 'primary' : 'default'}
            size='small'
          >
            {post.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}
