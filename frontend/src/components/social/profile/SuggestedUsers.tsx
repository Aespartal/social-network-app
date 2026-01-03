import React, { useEffect, useState } from 'react'
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Box,
  Divider,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { profileService } from '@/services/profile.service'
import { User } from 'social-network-app-shared/types/auth.type'
import { SuggestedUsersSkeleton } from '../skeleton/SuggestedUsersSkeleton'

export const SuggestedUsers: React.FC = () => {
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState<string[]>([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await profileService.getSuggestions(5)
        setSuggestions(response || [])
      } catch (err) {
        console.error('Error cargando sugerencias:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const handleFollow = async (userId: string) => {
    setFollowingIds(prev => [...prev, userId])
    try {
      console.log('Siguiendo a:', userId)
    } catch (err: unknown) {
      console.error('Error al seguir usuario:', err)
      setFollowingIds(prev => prev.filter(id => id !== userId))
    }
  }

  if (loading) return <SuggestedUsersSkeleton />

  if (suggestions.length === 0) return null

  return (
    <Paper
      variant='outlined'
      sx={{ borderRadius: 0, overflow: 'hidden', bgcolor: 'background.paper' }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant='subtitle1' fontWeight='bold'>
          Usuarios sugeridos
        </Typography>
      </Box>

      <List sx={{ width: '100%', p: 0 }}>
        {suggestions.map((user, index) => {
          const isFollowing = followingIds.includes(user.id)

          return (
            <React.Fragment key={user.id}>
              <ListItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  gap: 1.5,
                }}
              >
                <ListItemAvatar sx={{ minWidth: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={user.avatar || ''}
                    component={Link}
                    to={`/profile/${user.username}`}
                    sx={{
                      width: 40,
                      height: 40,
                      textDecoration: 'none',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    minWidth: 0,
                    m: 0,
                  }}
                  primary={
                    <Typography
                      variant='body2'
                      fontWeight='bold'
                      noWrap
                      component={Link}
                      to={`/profile/${user.username}`}
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      noWrap
                      display='block'
                    >
                      @{user.username}
                    </Typography>
                  }
                />

                <Button
                  variant={isFollowing ? 'contained' : 'outlined'}
                  size='small'
                  disabled={isFollowing}
                  onClick={() => handleFollow(user.id)}
                  sx={{
                    borderRadius: 20,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    minWidth: '85px',
                    textTransform: 'none',
                  }}
                >
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </Button>
              </ListItem>
              {index < suggestions.length - 1 && (
                <Divider variant='inset' component='li' sx={{ mr: 2 }} />
              )}
            </React.Fragment>
          )
        })}
      </List>

      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Button
          fullWidth
          size='small'
          component={Link}
          to='/explore/people'
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            color: 'primary.main',
            py: 1,
          }}
        >
          Mostrar más
        </Button>
      </Box>
    </Paper>
  )
}
