import { Box, Paper } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export const SuggestedUsersSkeleton = () => (
  <Paper variant='outlined' sx={{ p: 2, borderRadius: 4 }}>
    <Skeleton width='60%' height={24} sx={{ mb: 2 }} />
    {[1, 2, 3].map(i => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width='70%' height={20} />
          <Skeleton width='40%' height={15} />
        </Box>
        <Skeleton
          variant='rectangular'
          width={70}
          height={30}
          sx={{ borderRadius: 20, ml: 1 }}
        />
      </Box>
    ))}
  </Paper>
)
