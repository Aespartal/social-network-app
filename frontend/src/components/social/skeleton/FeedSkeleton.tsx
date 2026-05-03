import { Stack } from '@mui/material'
import { SkeletonPostCard } from '../post/SkeletonPostCard'

export const FeedSkeleton = () => (
  <Stack spacing={0} sx={{ mt: 2 }}>
    {[1, 2, 3].map(i => (
      <SkeletonPostCard key={i} />
    ))}
  </Stack>
)
