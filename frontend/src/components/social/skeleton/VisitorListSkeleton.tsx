import { Paper, Box, Skeleton, Divider } from '@mui/material'

export const VisitorListSkeleton = () => (
  <Paper variant='outlined' sx={{ borderRadius: 4, overflow: 'hidden' }}>
    <Box sx={{ p: 2 }}>
      <Skeleton width='50%' height={20} />
    </Box>
    <Divider />
    {[1, 2, 3].map(i => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
        <Skeleton variant='circular' width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width='60%' />
          <Skeleton width='40%' height={15} />
        </Box>
      </Box>
    ))}
  </Paper>
)
