import { Box, Text as Typography, Button } from '@/components/ui'
import { Post } from 'social-network-app-shared/types/social.type'
import { PostCard } from '@/components/social/post/PostCard'
import { useTheme } from '@mui/material'

// Estilos
import { getPostListStyles } from './PostList.styles'

interface PostListProps {
  posts: Post[]
  onLike: (id: string) => void
  onBookmark: (id: string) => void
  onReply: (post: Post) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

/**
 * PostList Refactorizado: Mosaic Feed (Aura)
 * Abandona la lista lineal por un diseño de mosaico dinámico.
 */
export const PostList = ({
  posts,
  onLike,
  onBookmark,
  onReply,
  hasMore,
  loadingMore,
  onLoadMore,
}: PostListProps) => {
  const theme = useTheme()
  const styles = getPostListStyles(theme)

  if (posts.length === 0 && !loadingMore) {
    return (
      <Box sx={styles.emptyContainer}>
        <Typography variant='h5' sx={styles.emptyTitle}>
          Tu lienzo está vacío
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Comparte tu aura o busca nuevas conexiones para llenar este espacio.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={styles.gridContainer}>
        {posts.map(post => {
          const impact = post.likesCount || 0

          return (
            <Box key={post.id} sx={styles.masonryItem(impact)}>
              <PostCard
                post={post}
                onLike={() => onLike(post.id)}
                onBookmark={() => onBookmark(post.id)}
                onReply={() => onReply(post)}
              />
            </Box>
          )
        })}
      </Box>

      {/* Footer / Load More (Intencional) */}
      {hasMore && (
        <Box sx={styles.loadingContainer}>
          <Button
            variant='outline'
            onClick={onLoadMore}
            disabled={loadingMore}
            loading={loadingMore}
            sx={{ px: 6, borderRadius: '50px' }}
          >
            {loadingMore ? 'Cargando más aura...' : 'Explorar más posts'}
          </Button>
        </Box>
      )}

      {!hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.4 }}>
          <Typography
            variant='caption'
            sx={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}
          >
            Has llegado al final de tu lienzo actual.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
