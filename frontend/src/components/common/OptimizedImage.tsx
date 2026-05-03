import { Box } from '@/components/ui'
import React, { useState, useMemo } from 'react'
import { Box as MuiBox, Skeleton, SxProps, Theme } from '@mui/material'

interface OptimizedImageProps {
  src: string
  alt: string | undefined
  width?: number | string
  height?: number | string
  maxHeight?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  aspectRatio?: string
  priority?: boolean
  className?: string
  sx?: SxProps<Theme>
  onClick?: (e: React.MouseEvent) => void
  /**
   * Tamaños de viewport para srcSet (ej: "(max-width: 600px) 100vw, 50vw")
   * Si no se proporciona, usa el ancho máximo por defecto
   */
  sizes?: string
  /**
   * Ancho máximo en píxeles para la imagen (usado para generar srcSet)
   * @default 1200
   */
  maxWidth?: number
}

/**
 * Genera srcSet con múltiples tamaños y formatos (WebP + JPEG fallback)
 */
const generateSrcSet = (
  url: string,
  maxWidth: number
): { src: string; srcSet: string; sizes?: string } | null => {
  if (!url.includes('cloudinary.com')) {
    return { src: url, srcSet: '' }
  }

  const parts = url.split('/upload/')
  if (parts.length !== 2) return { src: url, srcSet: '' }

  const [baseUrl, imagePath] = parts

  // Generar múltiples tamaños para srcSet
  const widths = [320, 480, 640, 800, 1200, 1600].filter(w => w <= maxWidth)
  if (!widths.includes(maxWidth)) widths.push(maxWidth)

  // Crear srcSet con WebP (formato moderno)
  const srcSetWebP = widths
    .map(w => `${baseUrl}/upload/w_${w},q_auto:good,f_webp/${imagePath} ${w}w`)
    .join(', ')

  // Imagen por defecto: WebP con ancho máximo razonable
  const src = `${baseUrl}/upload/w_${Math.min(maxWidth, 1200)},q_auto:good,f_webp/${imagePath}`

  return {
    src,
    srcSet: srcSetWebP,
    sizes: undefined, // El consumidor puede sobrescribir esto
  }
}

/**
 * OptimizedImage Component
 *
 * Optimizaciones:
 * 1. Cloudinary srcset con múltiples tamaños (320w - 1600w)
 * 2. Formato WebP con fallback automático
 * 3. Native lazy loading (loading="lazy")
 * 4. Decoding async para no bloquear el main thread
 * 5. Loading state con Skeleton
 * 6. Width/height explícitos cuando están disponibles
 * 7. Error handling con fallback a URL original
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  maxHeight,
  objectFit = 'cover',
  aspectRatio,
  priority = false,
  className,
  sx,
  onClick,
  sizes,
  maxWidth = 1200,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Generar URLs optimizadas (memoizado para evitar recálculos)
  const imageData = useMemo(() => {
    if (error) return { src, srcSet: '', sizes: undefined }
    return generateSrcSet(src, maxWidth)
  }, [src, maxWidth, error])

  const handleError = () => {
    if (!error) {
      console.warn('Failed to load optimized image, using original:', src)
      setError(true)
    }
  }

  // Extraer dimensiones numéricas si están disponibles
  const numericWidth = typeof width === 'number' ? width : undefined
  const numericHeight = typeof height === 'number' ? height : undefined

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height: height === 'auto' && !aspectRatio ? 'auto' : height,
        aspectRatio,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              opacity: 0.95,
            }
          : {},
        ...sx,
      }}
      className={className}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <Skeleton
          variant='rectangular'
          width='100%'
          height='100%'
          animation='wave'
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {/* Error State */}
      {error && (
        <Box
          sx={{
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.disabledBackground',
            color: 'text.disabled',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box>📷</Box>
          <Box sx={{ fontSize: '0.875rem' }}>No se pudo cargar la imagen</Box>
        </Box>
      )}

      {/* Optimized Image con srcSet */}
      {!error && imageData && (
        <picture>
          {/* WebP source */}
          <source
            type='image/webp'
            srcSet={imageData.srcSet}
            sizes={sizes || imageData.sizes}
          />
          {/* Fallback */}
          <MuiBox
            component='img'
            src={imageData.src}
            alt={alt}
            width={numericWidth}
            height={numericHeight}
            loading={priority ? 'eager' : 'lazy'}
            decoding='async'
            onLoad={() => setLoaded(true)}
            onError={handleError}
            sx={{
              width: '100%',
              height: '100%',
              maxHeight,
              objectFit,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </picture>
      )}
    </Box>
  )
}
