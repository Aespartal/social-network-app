import type { Theme } from '@mui/material/styles'

export const getPostListStyles = (theme: Theme) => ({
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(auto-fill, minmax(300px, 1fr))',
      md: 'repeat(auto-fill, minmax(350px, 1fr))',
    },
    gap: 3,
    p: 2,
    alignItems: 'start',
  },
  masonryItem: (impact: number) => ({
    gridColumn: {
      xs: 'span 1',
      sm: impact > 10 ? 'span 2' : 'span 1',
    },
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      transform: 'scale(1.01) translateY(-4px)',
      zIndex: 2,
    },
  }),
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 4,
    width: '100%',
  },
  emptyContainer: {
    textAlign: 'center',
    py: 12,
    px: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    width: '100%',
    gridColumn: '1 / -1',
  },
  emptyTitle: {
    fontFamily: theme.typography.h1.fontFamily,
    fontWeight: 800,
    opacity: 0.8,
  },
})
