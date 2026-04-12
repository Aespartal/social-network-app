import React from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
import { Verified as VerifiedIcon } from '@mui/icons-material'
import { Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Follower } from '@/services/follow.service'
import { FollowButton } from './FollowButton'

interface UserListProps {
  users: Follower[]
  emptyMessage: string
}

export const UserList: React.FC<UserListProps> = ({ users, emptyMessage }) => {
  if (!users || users.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color='text.secondary'>{emptyMessage}</Typography>
      </Box>
    )
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {users.map((user, index) => (
        <React.Fragment key={user.id}>
          <ListItem
            alignItems='center'
            secondaryAction={
              <FollowButton
                userId={user.id}
                initialIsFollowing={user.isFollowing}
                size='small'
              />
            }
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 64 }}>
              <OptimizedAvatar
                src={user.avatar}
                alt={user.name}
                size='lg'
                sx={{
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction='row' alignItems='center' spacing={0.5}>
                  <Link<typeof RouterLink>
                    component={RouterLink}
                    to={`/profile/${user.username}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {user.name}
                  </Link>
                  {user.verified && (
                    <Typography
                      component='span'
                      sx={{ color: 'primary.main', display: 'flex' }}
                    >
                      <VerifiedIcon sx={{ fontSize: '1rem' }} />
                    </Typography>
                  )}
                </Stack>
              }
              secondary={
                <Typography
                  component='span'
                  variant='body2'
                  color='text.secondary'
                >
                  @{user.username}
                </Typography>
              }
            />
          </ListItem>
          {index < users.length - 1 && <Divider component='li' />}
        </React.Fragment>
      ))}
    </List>
  )
}
