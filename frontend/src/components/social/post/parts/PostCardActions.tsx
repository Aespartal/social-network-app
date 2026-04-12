import { memo } from 'react'
import { Stack, IconButton, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteFilledIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkFilledIcon from '@mui/icons-material/Bookmark'
import { Post } from 'social-network-app-shared/types/social.type'

interface PostCardActionsProps {
  post: Post
  onLike: (id: string) => void
  onBookmark: (id: string) => void
  onReply: (post: Post) => void
}

export const PostCardActions = memo(
  ({ post, onLike, onBookmark, onReply }: PostCardActionsProps) => {
    return (
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1.5 }}>
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
      </Stack>
    )
  }
)
