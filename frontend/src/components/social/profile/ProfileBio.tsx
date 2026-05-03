import { Box, Stack, Text as Typography } from '@/components/ui'
import { Link } from 'react-router-dom'
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { User } from 'social-network-app-shared/types/auth.type'
import { alpha, useTheme } from '@mui/material'

export const ProfileBio = ({ user }: { user: User | null }) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        pb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Biografía Introspectiva */}
      {user?.bio && (
        <Typography
          variant='body1'
          sx={{
            mt: 2,
            maxWidth: 700,
            fontFamily: 'Lora, serif',
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: 'text.primary',
            opacity: 0.9,
            fontStyle: 'italic',
          }}
        >
          "{user.bio}"
        </Typography>
      )}

      {/* Meta Nodos (Identidad) */}
      <Stack
        direction='row'
        spacing={4}
        sx={{ mt: 5 }}
        flexWrap='wrap'
        justifyContent='center'
      >
        <MetaItem
          icon={<VisibilityIcon sx={{ fontSize: '1rem', opacity: 0.6 }} />}
          label='Impacto'
          count={user?._count.visitsReceived}
        />
        <MetaItem
          icon={<PeopleIcon sx={{ fontSize: '1rem', opacity: 0.6 }} />}
          label='Conexiones'
          count={user?._count.followers}
          link={`/profile/${user?.username}/followers`}
        />
        <MetaItem
          icon={<PeopleIcon sx={{ fontSize: '1rem', opacity: 0.6 }} />}
          label='Afinidad'
          count={user?._count.following}
          link={`/profile/${user?.username}/following`}
        />

        <Stack direction='row' spacing={0.5} alignItems='center'>
          <CalendarIcon
            sx={{ fontSize: '1rem', color: 'text.secondary', opacity: 0.6 }}
          />
          <Typography variant='caption' color='text.secondary'>
            En Aura desde{' '}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric',
                })
              : ''}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

const MetaItem = ({
  icon,
  label,
  count,
  link,
}: {
  icon: React.ReactNode
  label: string
  count?: number
  link?: string
}) => {
  const theme = useTheme()

  const content = (
    <Stack
      direction='row'
      spacing={1}
      alignItems='center'
      sx={{ transition: 'all 0.2s' }}
    >
      <Box
        sx={{
          display: 'flex',
          p: 0.8,
          borderRadius: '10px',
          bgcolor: alpha(theme.palette.divider, 0.05),
          color: 'text.secondary',
        }}
      >
        {icon}
      </Box>
      <Stack spacing={-0.5} alignItems='flex-start'>
        <Typography variant='body2' sx={{ fontWeight: 800 }}>
          {count || 0}
        </Typography>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  )

  if (link) {
    return (
      <Box
        component={Link}
        to={link}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': {
            transform: 'translateY(-2px)',
            '& .MuiTypography-root': { color: 'primary.main' },
            '& .MuiBox-root': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            },
          },
        }}
      >
        {content}
      </Box>
    )
  }

  return content
}
