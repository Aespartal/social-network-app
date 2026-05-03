import { useState, memo } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { useNavigate } from 'react-router-dom'
import { Box, Card } from '@/components/ui'
import { useTheme } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { ImageModal } from '@/components/common/ImageModal'

// Sub-piezas Atómicas Zen
import {
  PostCardHeader,
  PostCardActions,
  PostCardContent,
  PostCardFooter,
} from './parts'

// Estilos
import { getPostCardStyles } from './PostCard.styles'

export interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onReply: (post: Post) => void
  className?: string
  sx?: SxProps<Theme>
}

/**
 * PostCard: Zen Edition
 * Un diseño biofílico que prioriza el contenido y la calma.
 */
export const PostCard = memo(
  ({ post, onLike, onBookmark, onReply, className, sx }: PostCardProps) => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [imageModalOpen, setImageModalOpen] = useState(false)

    const getAuraEffect = () => {
      const impact = post.likesCount || 0
      if (impact === 0) return 'none'
      const intensity = Math.min(impact * 0.02, 0.2) // Un poco más vibrante en el nuevo diseño
      const accentColor = '#E0FF4F'
      const hexIntensity = Math.floor(intensity * 255)
        .toString(16)
        .padStart(2, '0')
      return `radial-gradient(circle at bottom right, ${accentColor}${hexIntensity}, transparent 70%)`
    }

    const auraStyle = getAuraEffect()
    const styles = getPostCardStyles(theme, auraStyle)

    const handleCardClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('img')
      )
        return
      if (globalThis.location.pathname === `/post/${post.id}`) return
      navigate(`/post/${post.id}`)
    }

    return (
      <Box sx={styles.container}>
        <Card
          variant='outlined'
          onClick={handleCardClick}
          className={className}
          sx={styles.card(sx)}
        >
          {/* 1. Cabecera Zen (Contexto y Tiempo de Lectura) */}
          <PostCardHeader post={post} styles={styles} />

          {/* 2. Cuerpo (Título, Texto con degradado, Media) */}
          <PostCardContent
            post={post}
            styles={styles}
            onImageClick={e => {
              e.stopPropagation()
              setImageModalOpen(true)
            }}
          />

          {/* 3. Pie de Tarjeta (Autor Minimalista y Acciones) */}
          <PostCardFooter
            post={post}
            styles={styles}
            actions={
              <PostCardActions
                post={post}
                onLike={() => onLike(post.id)}
                onBookmark={() => onBookmark(post.id)}
                onReply={() => onReply(post)}
                styles={styles}
              />
            }
          />
        </Card>

        {post.image && (
          <ImageModal
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            imageUrl={post.image}
            altText='Contenido visual de Aura'
          />
        )}
      </Box>
    )
  }
)

PostCard.displayName = 'PostCard'
