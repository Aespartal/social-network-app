import React, { useEffect, useState } from 'react'
import {
  Box,
  Text as Typography,
  Stack,
  Alert,
  Avatar,
  Button,
} from '@/components/ui'
import {
  useTheme,
  useMediaQuery,
  alpha,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import {
  Verified as VerifiedIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { profileService } from '@/services'
import { User } from 'social-network-app-shared/types/auth.type'
import { FeedSkeleton } from '@/components/social/skeleton/FeedSkeleton'
import { HomeSidebar } from '@/components/social/home/HomeSidebar'

export const ExplorePeople: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await profileService.getSuggestions(50)
        setUsers(data)
      } catch (err) {
        console.error('Error fetching suggested users:', err)
        setError('No se pudieron cargar las sugerencias.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        // bgcolor: 'background.default',
        width: '100%',
      }}
    >
      {/* 1. COLUMNA PRINCIPAL */}
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: '600px',
          borderRight: '1px solid',
          borderColor: 'divider',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            variant='ghost'
            size='small'
            onClick={() => navigate(-1)}
            sx={{ minWidth: 'auto', p: 1, borderRadius: '50%' }}
          >
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography variant='h6' fontWeight={800}>
              A quién seguir
            </Typography>
          </Box>
        </Box>

        <Stack>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <FeedSkeleton />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Alert severity='error' variant='outlined'>
                {error}
              </Alert>
            </Box>
          ) : (
            <List>
              {users.map(user => (
                <ListItem
                  key={user.id}
                  sx={{
                    py: 2,
                    px: 3,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                  }}
                  onClick={() => handleUserClick(user.username)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatar || undefined}
                      alt={user.name}
                      sx={{ width: 48, height: 48 }}
                    >
                      {user.name?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography fontWeight={700} variant='body1'>
                          {user.name}
                        </Typography>
                        {user.verified && (
                          <VerifiedIcon color='primary' sx={{ fontSize: 18 }} />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Typography variant='body2' color='text.secondary'>
                        @{user.username}
                      </Typography>
                    }
                  />
                  <Button
                    variant='outline'
                    size='small'
                    sx={{
                      borderRadius: 20,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      minWidth: 80,
                    }}
                    onClick={e => {
                      e.stopPropagation()
                      // Logic for following would go here
                    }}
                  >
                    Seguir
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </Box>

      {/* 2. COLUMNA LATERAL */}
      {!isMobile && (
        <Box
          sx={{
            width: '350px',
            p: 2,
            display: { xs: 'none', lg: 'block' },
            flexShrink: 0,
          }}
        >
          <HomeSidebar />
        </Box>
      )}
    </Box>
  )
}

export default ExplorePeople
