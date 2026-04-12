/**
 * Componentes Base tipados - Sistema de Diseño
 *
 * Componentes que aplican tokens de diseño de forma consistente.
 * Son wrappers tipados alrededor de MUI con valores por defecto basados en tokens.
 */

import { forwardRef } from 'react'
import {
  Box as MuiBox,
  Typography as MuiTypography,
  Button as MuiButton,
  Avatar as MuiAvatar,
  Chip as MuiChip,
  Card as MuiCard,
  type BoxProps as MuiBoxProps,
  type TypographyProps as MuiTypographyProps,
  type ButtonProps as MuiButtonProps,
  type AvatarProps as MuiAvatarProps,
  type ChipProps as MuiChipProps,
  type CardProps as MuiCardProps,
} from '@mui/material'
import {
  tokens,
  type SpacingToken,
  type BorderRadiusToken,
  type FontSizeToken,
  type AvatarToken,
} from './tokens'

// ============================================================================
// 1. BOX - Contenedor flexible con tokens
// ============================================================================

export interface BoxProps extends Omit<
  MuiBoxProps,
  'p' | 'px' | 'py' | 'm' | 'mx' | 'my' | 'gap'
> {
  /** Padding uniforme - usa tokens.spacing */
  p?: SpacingToken | number
  /** Padding horizontal - usa tokens.spacing */
  px?: SpacingToken | number
  /** Padding vertical - usa tokens.spacing */
  py?: SpacingToken | number
  /** Padding top - usa tokens.spacing */
  pt?: SpacingToken | number
  /** Padding bottom - usa tokens.spacing */
  pb?: SpacingToken | number
  /** Padding left - usa tokens.spacing */
  pl?: SpacingToken | number
  /** Padding right - usa tokens.spacing */
  pr?: SpacingToken | number
  /** Margin uniforme - usa tokens.spacing */
  m?: SpacingToken | number
  /** Margin horizontal - usa tokens.spacing */
  mx?: SpacingToken | number
  /** Margin vertical - usa tokens.spacing */
  my?: SpacingToken | number
  /** Margin top - usa tokens.spacing */
  mt?: SpacingToken | number
  /** Margin bottom - usa tokens.spacing */
  mb?: SpacingToken | number
  /** Margin left - usa tokens.spacing */
  ml?: SpacingToken | number
  /** Margin right - usa tokens.spacing */
  mr?: SpacingToken | number
  /** Gap entre elementos - usa tokens.spacing */
  gap?: SpacingToken | number
  /** Border radius - usa tokens.borderRadius */
  rounded?: BorderRadiusToken | number
}

const getSpacingValue = (
  value: SpacingToken | number | undefined
): number | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return tokens.spacing[value]
}

const getBorderRadiusValue = (
  value: BorderRadiusToken | number | undefined
): number | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return tokens.borderRadius[value]
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      gap,
      rounded,
      sx,
      ...props
    },
    ref
  ) => {
    const spacingSx = {
      p: getSpacingValue(p),
      px: getSpacingValue(px),
      py: getSpacingValue(py),
      pt: getSpacingValue(pt),
      pb: getSpacingValue(pb),
      pl: getSpacingValue(pl),
      pr: getSpacingValue(pr),
      m: getSpacingValue(m),
      mx: getSpacingValue(mx),
      my: getSpacingValue(my),
      mt: getSpacingValue(mt),
      mb: getSpacingValue(mb),
      ml: getSpacingValue(ml),
      mr: getSpacingValue(mr),
      gap: getSpacingValue(gap),
      borderRadius: getBorderRadiusValue(rounded),
    }

    // Filtrar valores undefined
    const cleanSpacingSx = Object.fromEntries(
      Object.entries(spacingSx).filter(([, v]) => v !== undefined)
    )

    return <MuiBox ref={ref} sx={{ ...cleanSpacingSx, ...sx }} {...props} />
  }
)
Box.displayName = 'Box'

// ============================================================================
// 2. TYPOGRAPHY - Texto con tokens tipográficos
// ============================================================================

export interface TypographyProps extends Omit<
  MuiTypographyProps,
  'fontSize' | 'fontWeight'
> {
  /** Tamaño de fuente - usa tokens.fontSize */
  size?: FontSizeToken
  /** Peso de fuente - usa tokens.fontWeight */
  weight?: keyof typeof tokens.fontWeight
}

export const Typography = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ size, weight, sx, ...props }, ref) => {
    const customSx = {
      ...(size && { fontSize: tokens.fontSize[size] }),
      ...(weight && { fontWeight: tokens.fontWeight[weight] }),
      ...sx,
    }

    return <MuiTypography ref={ref} sx={customSx} {...props} />
  }
)
Typography.displayName = 'Typography'

// ============================================================================
// 3. BUTTON - Botón con tokens consistentes
// ============================================================================

export interface ButtonProps extends Omit<MuiButtonProps, 'size'> {
  /** Tamaño predefinido */
  size?: 'small' | 'medium' | 'large'
  /** Variante de color semántico */
  colorVariant?: 'primary' | 'secondary' | 'like' | 'retweet'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'medium', colorVariant = 'primary', sx, ...props }, ref) => {
    const getColor = () => {
      switch (colorVariant) {
        case 'like':
          return { color: tokens.semanticColors.like }
        case 'retweet':
          return { color: tokens.semanticColors.retweet }
        default:
          return {}
      }
    }

    return (
      <MuiButton
        ref={ref}
        size={size}
        sx={{ ...getColor(), ...sx }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// ============================================================================
// 4. AVATAR - Con tamaños tokenizados
// ============================================================================

export interface AvatarProps extends Omit<MuiAvatarProps, 'sizes'> {
  /** Tamaño predefinido - usa tokens.avatar */
  size?: AvatarToken
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ size = 'md', sx, ...props }, ref) => {
    const sizeValue = tokens.avatar[size]

    return (
      <MuiAvatar
        ref={ref}
        sx={{
          width: sizeValue,
          height: sizeValue,
          ...sx,
        }}
        {...props}
      />
    )
  }
)
Avatar.displayName = 'Avatar'

// ============================================================================
// 5. CHIP - Tag con estilos consistentes
// ============================================================================

export interface ChipProps extends MuiChipProps {
  /** Variante de color semántico */
  colorVariant?: 'primary' | 'secondary' | 'like' | 'retweet' | 'default'
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ colorVariant = 'default', sx, ...props }, ref) => {
    const getChipStyles = () => {
      switch (colorVariant) {
        case 'like':
          return {
            backgroundColor: `${tokens.semanticColors.like}20`,
            color: tokens.semanticColors.like,
          }
        case 'retweet':
          return {
            backgroundColor: `${tokens.semanticColors.retweet}20`,
            color: tokens.semanticColors.retweet,
          }
        case 'primary':
          return {
            backgroundColor: `${tokens.semanticColors.primary}20`,
            color: tokens.semanticColors.primary,
          }
        default:
          return {}
      }
    }

    return <MuiChip ref={ref} sx={{ ...getChipStyles(), ...sx }} {...props} />
  }
)
Chip.displayName = 'Chip'

// ============================================================================
// 6. CARD - Contenedor con sombras adaptativas
// ============================================================================

export interface CardProps extends Omit<MuiCardProps, 'elevation'> {
  /** Si debe aplicar sombra de hover */
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, sx, ...props }, ref) => {
    return (
      <MuiCard
        ref={ref}
        elevation={0}
        sx={{
          transition: `box-shadow ${tokens.transition.normal} ${tokens.transition.easing}`,
          ...(hoverable && {
            '&:hover': {
              boxShadow: (theme: { palette: { mode: string } }) =>
                theme.palette.mode === 'dark'
                  ? tokens.shadows.hover.dark
                  : tokens.shadows.hover.light,
            },
          }),
          ...sx,
        }}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
