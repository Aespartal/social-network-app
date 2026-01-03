import { Box, Stack, Typography } from '@mui/material'
import {
  Verified as VerifiedIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { User } from 'social-network-app-shared/types/auth.type'

export const ProfileBio = ({ user }: { user: User | null }) => (
  <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
    <Stack spacing={0.5}>
      <Stack direction='row' alignItems='center' spacing={1}>
        <Typography variant='h5' fontWeight='bold'>
          {user?.name}
        </Typography>
        {user?.verified && <VerifiedIcon color='primary' fontSize='small' />}
      </Stack>
      <Typography variant='body1' color='text.secondary'>
        @{user?.username}
      </Typography>
    </Stack>

    {user?.bio && (
      <Typography variant='body1' sx={{ mt: 2, maxWidth: 600 }}>
        {user.bio}
      </Typography>
    )}

    <Stack direction='row' spacing={3} sx={{ mt: 3 }} flexWrap='wrap'>
      <MetaItem
        icon={<VisibilityIcon fontSize='small' />}
        label='Visitas'
        count={user?._count.visitsReceived}
      />
      <Stack direction='row' spacing={0.5} alignItems='center'>
        <CalendarIcon fontSize='small' sx={{ color: 'text.secondary' }} />
        <Typography variant='caption' color='text.secondary'>
          Se unió en{' '}
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
        </Typography>
      </Stack>
      <MetaItem
        icon={<PeopleIcon fontSize='small' />}
        label='Seguidores'
        count={user?._count.followers}
      />
    </Stack>
  </Box>
)

const MetaItem = ({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode
  label: string
  count?: number
}) => (
  <Stack direction='row' spacing={0.5} alignItems='center'>
    {icon}
    <Typography variant='caption' color='text.secondary' fontWeight='bold'>
      {count || 0}{' '}
      <Typography
        component='span'
        variant='caption'
        sx={{ fontWeight: 'normal' }}
      >
        {label}
      </Typography>
    </Typography>
  </Stack>
)
