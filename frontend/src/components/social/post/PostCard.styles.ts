import { alpha, styled } from '@mui/material/styles'
import { PostCard } from '@/components/social/post/PostCard'

export const StyledPostCard = styled(PostCard)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: 200,
  }),
  padding: theme.spacing(1),

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.action.hover, 0.04)
        : alpha(theme.palette.common.white, 0.02),
  },

  // 3. Tipografía Profesional
  '& .MuiTypography-body1': {
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },

  // 4. Estilo para los nombres de usuario/metadata
  '& .post-metadata': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },

  // 5. Ajuste para Imágenes/Media dentro del Post
  '& img': {
    borderRadius: `calc(${theme.shape.borderRadius}px * 2)`,
  },

  // 6. Efecto de "Focus" para accesibilidad
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '-2px',
  },
}))
