import {
  IconButton,
  Typography,
  Box,
  SxProps,
  Theme,
  alpha,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface PostHeaderProps {
  onNavigateBack: () => void
  title?: string
  sx?: SxProps<Theme>
}

export const PostHeader = ({
  onNavigateBack,
  title = 'Post',
  sx,
}: PostHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        px: 2,
        py: 0.75,
        minHeight: '53px',
        ...sx,
      }}
    >
      <IconButton
        onClick={onNavigateBack}
        size='medium'
        aria-label='Volver atrás'
        sx={{
          color: 'text.primary',
          '&:hover': { bgcolor: t => alpha(t.palette.text.primary, 0.1) },
        }}
      >
        <ArrowBackIcon fontSize='small' />
      </IconButton>
      <Box>
        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 800, lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        {/* Optional: could add post count or subtitle here */}
      </Box>
    </Box>
  )
}
