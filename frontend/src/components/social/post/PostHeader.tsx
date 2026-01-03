import { IconButton, Typography, Box, SxProps, Theme } from '@mui/material'
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
        gap: 2,
        mb: 2,
        ...sx,
      }}
    >
      <IconButton
        onClick={onNavigateBack}
        size='small'
        aria-label='Volver atrás'
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant='h6' fontWeight='bold'>
        {title}
      </Typography>
    </Box>
  )
}
