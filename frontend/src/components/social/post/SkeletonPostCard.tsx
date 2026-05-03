import { Box, Skeleton, alpha, useTheme } from '@mui/material'

export const SkeletonPostCard = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: '32px',
        bgcolor: alpha(theme.palette.background.paper, 0.4),
        border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        mb: 3,
        width: '100%',
        animation: 'soft-pulse 3s infinite ease-in-out',
        '@keyframes soft-pulse': {
          '0%': { opacity: 0.4 },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 0.4 },
        },
      }}
    >
      {/* 1. Header Skeleton (Coincidiendo con PostCardHeader) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          alignItems: 'center',
        }}
      >
        <Skeleton
          variant='rectangular'
          width={70}
          height={24}
          sx={{
            borderRadius: '12px',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        />
        <Skeleton
          variant='text'
          width={100}
          height={20}
          sx={{ opacity: 0.5 }}
        />
      </Box>

      {/* 2. Content Skeleton (Líneas de texto Zen) */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant='text' width='95%' height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant='text' width='85%' height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant='text' width='60%' height={28} />
      </Box>

      {/* 3. Footer Skeleton (Autor + Acciones) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant='circular' width={32} height={32} />
          <Skeleton variant='text' width={120} height={20} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton
            variant='circular'
            width={20}
            height={20}
            sx={{ opacity: 0.5 }}
          />
          <Skeleton
            variant='circular'
            width={20}
            height={20}
            sx={{ opacity: 0.5 }}
          />
          <Skeleton
            variant='circular'
            width={20}
            height={20}
            sx={{ opacity: 0.5 }}
          />
        </Box>
      </Box>
    </Box>
  )
}
