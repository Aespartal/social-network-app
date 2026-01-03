import { Paper, Stack, Skeleton } from '@mui/material'

export const PostSkeleton = () => (
  <Paper variant='outlined' sx={{ borderRadius: 4, p: 2, mb: 2 }}>
    <Stack spacing={2}>
      <Skeleton variant='rectangular' height={150} sx={{ borderRadius: 2 }} />
      <Skeleton width='80%' />
      <Skeleton width='60%' />
    </Stack>
  </Paper>
)
