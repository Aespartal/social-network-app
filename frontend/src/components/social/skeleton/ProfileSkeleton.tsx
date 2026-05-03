import { Box, Skeleton, Stack, alpha, useTheme } from '@mui/material'
import {
  ProfileContainer,
  ProfileMainColumn,
  ProfileContentWrapper,
} from '../../../pages/Profile.styles'

export const ProfileSkeleton = () => {
  const theme = useTheme()

  return (
    <ProfileContainer>
      <ProfileMainColumn>
        {/* 1. Banner Skeleton (Simulando AuraHeader) */}
        <Box
          sx={{
            height: '280px',
            width: '100%',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 4,
          }}
        >
          <Skeleton
            variant='circular'
            width={120}
            height={120}
            sx={{ border: '4px solid transparent' }}
          />
        </Box>

        <ProfileContentWrapper sx={{ py: 4 }}>
          <Stack spacing={3}>
            {/* 2. Bio & Info Skeleton */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Skeleton variant='text' width={200} height={40} />
              <Skeleton variant='text' width={150} height={20} />
            </Box>

            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 2 }}
            >
              <Skeleton variant='text' width={80} height={24} />
              <Skeleton variant='text' width={80} height={24} />
              <Skeleton variant='text' width={80} height={24} />
            </Box>

            <Skeleton
              variant='rectangular'
              width='100%'
              height={80}
              sx={{ borderRadius: '24px' }}
            />

            {/* 3. Tabs Skeleton */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 4 }}>
              <Stack direction='row' spacing={4} justifyContent='center'>
                <Skeleton variant='text' width={100} height={30} />
                <Skeleton variant='text' width={100} height={30} />
                <Skeleton variant='text' width={100} height={30} />
              </Stack>
            </Box>

            {/* 4. Posts Skeleton */}
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Skeleton
                variant='rectangular'
                width='100%'
                height={150}
                sx={{ borderRadius: '32px' }}
              />
              <Skeleton
                variant='rectangular'
                width='100%'
                height={150}
                sx={{ borderRadius: '32px' }}
              />
            </Stack>
          </Stack>
        </ProfileContentWrapper>
      </ProfileMainColumn>
    </ProfileContainer>
  )
}
