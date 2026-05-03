import { Typography, Box, IconButton, useTheme } from '@mui/material'
import {
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  ChatBubbleOutline as CommentIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  IosShare as ShareIcon,
} from '@mui/icons-material'
import { Post } from 'social-network-app-shared/types/social.type'
import type { getPostCardStyles } from '../PostCard.styles'
import { useAuth } from '@/hooks'

type PostCardStyles = ReturnType<typeof getPostCardStyles>

interface PostCardActionsProps {
  post: Post
  onLike: () => void
  onBookmark: () => void
  onReply: () => void
  styles: PostCardStyles
}

export const PostCardActions: React.FC<PostCardActionsProps> = ({
  post,
  onLike,
  onBookmark,
  onReply,
  styles,
}) => {
  const theme = useTheme()
  const { isAuthenticated } = useAuth()

  const handleAction = (callback: () => void) => {
    if (!isAuthenticated) return
    callback()
  }

  return (
    <Box sx={styles.actions} onClick={e => e.stopPropagation()}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: isAuthenticated ? 1 : 0.4,
        }}
      >
        <IconButton
          onClick={() => handleAction(onReply)}
          sx={styles.actionIcon()}
          disabled={!isAuthenticated}
        >
          <CommentIcon />
        </IconButton>
        {post.repliesCount > 0 && (
          <Typography sx={styles.countText}>{post.repliesCount}</Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: isAuthenticated ? 1 : 0.4,
        }}
      >
        <IconButton
          onClick={() => handleAction(onLike)}
          sx={styles.actionIcon(
            post.isLiked ? theme.palette.error.main : undefined
          )}
          disabled={!isAuthenticated}
        >
          {post.isLiked ? <FavoriteFilledIcon /> : <FavoriteIcon />}
        </IconButton>
        {post.likesCount > 0 && (
          <Typography sx={styles.countText}>{post.likesCount}</Typography>
        )}
      </Box>

      <IconButton
        onClick={() => handleAction(onBookmark)}
        sx={{
          ...styles.actionIcon(
            post.isBookmarked ? theme.palette.primary.main : undefined
          ),
          opacity: isAuthenticated ? 1 : 0.4,
        }}
        disabled={!isAuthenticated}
      >
        {post.isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
      </IconButton>

      <IconButton sx={styles.actionIcon()}>
        <ShareIcon />
      </IconButton>
    </Box>
  )
}
