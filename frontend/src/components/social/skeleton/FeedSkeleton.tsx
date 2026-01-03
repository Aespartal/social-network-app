import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'

export const FeedSkeleton = () => (
  <Stack spacing={2}>
    {[1, 2, 3].map(i => (
      <Card key={i} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <Skeleton
              variant='circular'
              width={40}
              height={40}
              sx={{ mr: 2 }}
            />
            <Box flex={1}>
              <Skeleton width='40%' height={20} />
              <Skeleton width='20%' height={15} />
            </Box>
          </Box>
          <Skeleton
            variant='rectangular'
            height={120}
            sx={{ borderRadius: 1 }}
          />
        </CardContent>
      </Card>
    ))}
  </Stack>
)
