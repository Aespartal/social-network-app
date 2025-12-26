import { Post } from 'social-network-app-shared/types/social';

import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteFilledIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkFilledIcon from '@mui/icons-material/Bookmark';
import { Card, CardContent } from '../ui';
import { Avatar, Box, CardActions, IconButton, Stack, Typography } from '@mui/material';

export interface PostCardProps {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
};

export const PostCard = ({ post, onLike, onBookmark }: PostCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
        <Avatar src={post.author.avatar || ''} />
        <Box>
          <Typography variant="subtitle2" lineHeight={1}>{post.author.name}</Typography>
          <Typography variant="caption" color="text.secondary">@{post.author.username}</Typography>
        </Box>
      </Stack>
      <Typography variant="body1">{post.content}</Typography>
    </CardContent>
    <CardActions sx={{ px: 2, pb: 1, justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" onClick={onLike} color={post.isLiked ? 'error' : 'default'}>
          {post.isLiked ? <FavoriteFilledIcon /> : <FavoriteIcon />}
        </IconButton>
        <Typography variant="caption">{post.likesCount}</Typography>
        
        <IconButton size="small"><CommentIcon fontSize="small" /></IconButton>
        <Typography variant="caption">{post.commentsCount}</Typography>
      </Stack>
      <IconButton size="small" onClick={onBookmark} color={post.isBookmarked ? 'primary' : 'default'}>
        {post.isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
      </IconButton>
    </CardActions>
  </Card>
);
