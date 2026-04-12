import React, { useState, useMemo } from 'react'
import { Avatar as MuiAvatar, AvatarProps, Skeleton } from '@mui/material'

interface OptimizedAvatarProps extends Omit<AvatarProps, 'src'> {
  src: string | null | undefined
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  lazy?: boolean
}

/**
 * Tamaños de avatares en píxeles (debe coincidir con tokens.avatar)
 */
const AVATAR_SIZES = {
  xs: 20,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
} as const

/**
 * Genera URLs optimizadas para Cloudinary con diferentes tamaños y formatos
 */
const generateCloudinarySrcSet = (
  url: string,
  baseSize: number
): { src: string; srcSet: string; sizes: string } | null => {
  if (!url || !url.includes('cloudinary.com')) {
    return null
  }

  const parts = url.split('/upload/')
  if (parts.length !== 2) return null

  const [baseUrl, imagePath] = parts

  // Generar múltiples tamaños: 1x, 1.5x, 2x, 3x
  const sizes = [
    baseSize,
    Math.round(baseSize * 1.5),
    baseSize * 2,
    baseSize * 3,
  ]

  // Crear srcSet con WebP (formato moderno) y JPEG fallback
  const srcSetWebP = sizes
    .map(
      size =>
        `${baseUrl}/upload/w_${size},h_${size},c_fill,q_auto:good,f_webp/${imagePath} ${size}w`
    )
    .join(', ')

  const srcSetJpeg = sizes
    .map(
      size =>
        `${baseUrl}/upload/w_${size},h_${size},c_fill,q_auto:good,f_jpg/${imagePath} ${size}w`
    )
    .join(', ')

  // La imagen por defecto es WebP del tamaño base
  const src = `${baseUrl}/upload/w_${baseSize},h_${baseSize},c_fill,q_auto:good,f_webp/${imagePath}`

  // Sizes attribute para indicar al navegador qué tamaño usar
  const sizesAttr = `${baseSize}px`

  return { src, srcSet: `${srcSetWebP}, ${srcSetJpeg}`, sizes: sizesAttr }
}

/**
 * OptimizedAvatar Component
 *
 * Optimizaciones:
 * 1. Cloudinary srcset con WebP y múltiples tamaños
 * 2. Lazy loading nativo
 * 3. Decode async para no bloquear el hilo principal
 * 4. Width/height explícitos para prevenir CLS
 * 5. Placeholder skeleton durante carga
 * 6. Optimización automática de formatos (WebP > JPEG)
 */
export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  lazy = true,
  sx,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const sizeInPx = typeof size === 'number' ? size : AVATAR_SIZES[size]

  const imageData = useMemo(() => {
    if (!src) return null
    return generateCloudinarySrcSet(src, sizeInPx)
  }, [src, sizeInPx])

  if (!src || error || !imageData) {
    return (
      <MuiAvatar
        sx={{
          width: sizeInPx,
          height: sizeInPx,
          bgcolor: 'action.hover',
          ...sx,
        }}
        {...props}
      >
        {alt ? alt.charAt(0).toUpperCase() : '?'}
      </MuiAvatar>
    )
  }

  return (
    <MuiAvatar
      sx={{
        width: sizeInPx,
        height: sizeInPx,
        position: 'relative',
        bgcolor: 'action.hover',
        ...sx,
      }}
      {...props}
    >
      {!loaded && (
        <Skeleton
          variant='circular'
          width={sizeInPx}
          height={sizeInPx}
          animation='wave'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      <picture>
        <source
          type='image/webp'
          srcSet={imageData.srcSet}
          sizes={imageData.sizes}
        />
        <img
          src={imageData.src}
          alt={alt}
          width={sizeInPx}
          height={sizeInPx}
          loading={lazy ? 'lazy' : 'eager'}
          decoding='async'
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        />
      </picture>
    </MuiAvatar>
  )
}

export default OptimizedAvatar
