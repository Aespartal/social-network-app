import React from 'react'
import { Link } from 'react-router-dom'
import { OptimizedAvatar } from '@/components/common'
import { Button, Text as Typography, Box } from '@/components/ui'
import { User } from 'social-network-app-shared/types/auth.type'
import type { getSuggestedUsersStyles } from '../SuggestedUsers.styles'

type SuggestedUsersStyles = ReturnType<typeof getSuggestedUsersStyles>

interface SuggestedUserItemProps {
  user: User
  isFollowing: boolean
  onFollow: (id: string) => void
  styles: SuggestedUsersStyles
}

export const SuggestedUserItem: React.FC<SuggestedUserItemProps> = ({
  user,
  isFollowing,
  onFollow,
  styles,
}) => {
  return (
    <Box sx={styles.item}>
      <Box
        component={Link}
        to={`/profile/${user.username}`}
        sx={{ textDecoration: 'none', display: 'flex' }}
      >
        <OptimizedAvatar
          src={user.avatar}
          alt={user.name}
          size='md'
          sx={styles.avatar}
        />
      </Box>

      <Box
        sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Typography
          variant='body2'
          noWrap
          component={Link}
          to={`/profile/${user.username}`}
          sx={styles.name}
        >
          {user.name}
        </Typography>
        <Typography variant='caption' noWrap sx={styles.username}>
          @{user.username}
        </Typography>
      </Box>

      <Button
        variant={isFollowing ? 'primary' : 'outline'}
        size='small'
        disabled={isFollowing}
        onClick={e => {
          e.preventDefault()
          onFollow(user.id)
        }}
        className='connect-button'
        sx={styles.button(isFollowing)}
      >
        {isFollowing ? 'CONECTADO' : 'CONECTAR'}
      </Button>
    </Box>
  )
}
