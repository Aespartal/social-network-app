import { alpha, styled } from '@mui/material/styles'
import { PostCard, PostCardProps } from '@/components/social/post/PostCard'

export const StyledPostCard = styled(PostCard)<PostCardProps>(
  ({ theme, isThreadParent }) => ({
    borderBottom: isThreadParent
      ? 'none'
      : `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    cursor: 'pointer',
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: 200,
    }),
    padding: theme.spacing(0),

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? alpha(theme.palette.action.hover, 0.04)
          : alpha(theme.palette.common.white, 0.02),
    },

    '& .MuiTypography-body1': {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      color: theme.palette.text.primary,
      letterSpacing: '-0.01em',
    },

    '& .post-metadata': {
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
    },

    '& img': {
      borderRadius: `calc(${theme.shape.borderRadius}px * 2)`,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '-2px',
    },
  })
)
