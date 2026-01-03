import { Container, Skeleton, Box } from "@mui/material";

export const ProfileSkeleton = () => (
  <Container maxWidth='md' sx={{ py: 4 }}>
    <Skeleton variant='rectangular' height={180} sx={{ borderRadius: 4 }} />
    <Box sx={{ px: 4 }}>
      <Skeleton
        variant='circular'
        width={120}
        height={120}
        sx={{ mt: -7, border: '4px solid white' }}
      />
      <Skeleton width='40%' height={40} sx={{ mt: 2 }} />
      <Skeleton width='20%' />
      <Skeleton
        variant='rectangular'
        height={100}
        sx={{ mt: 3, borderRadius: 2 }}
      />
    </Box>
  </Container>
)