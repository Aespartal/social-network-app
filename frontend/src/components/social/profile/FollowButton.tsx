import React, { useState, useEffect } from 'react'
import { Button, CircularProgress, useTheme } from '@mui/material'
import { followService } from '@/services'
import { useAuth } from '@/hooks'

interface FollowButtonProps {
  userId: string
  initialIsFollowing?: boolean
  onStatusChange?: (isFollowing: boolean) => void
  size?: 'small' | 'medium' | 'large'
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialIsFollowing,
  onStatusChange,
  size = 'medium',
}) => {
  const theme = useTheme()
  const { user: currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(initialIsFollowing === undefined)

  const isMe = currentUser?.id === userId

  useEffect(() => {
    if (initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing)
      setChecking(false)
      return
    }

    if (!currentUser || isMe) {
      setChecking(false)
      return
    }

    const checkStatus = async () => {
      try {
        const status = await followService.isFollowing(userId)
        setIsFollowing(status)
      } catch {
        setIsFollowing(false)
      } finally {
        setChecking(false)
      }
    }

    checkStatus()
  }, [userId, initialIsFollowing, currentUser, isMe])

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!currentUser) {
      return
    }

    setLoading(true)
    const previousState = isFollowing

    setIsFollowing(!previousState)
    if (onStatusChange) onStatusChange(!previousState)

    try {
      if (previousState) {
        await followService.unfollow(userId)
      } else {
        await followService.follow(userId)
      }
    } catch {
      setIsFollowing(previousState)
      if (onStatusChange) onStatusChange(previousState)
    } finally {
      setLoading(false)
    }
  }

  if (isMe || !currentUser) {
    return null
  }
  if (checking) {
    return <CircularProgress size={20} />
  }

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      color={isFollowing ? 'inherit' : 'primary'}
      onClick={handleToggleFollow}
      disabled={loading}
      size={size}
      sx={{
        borderRadius: theme.tokens.borderRadius.xl,
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '100px',
        '&:hover': {
          bgcolor: isFollowing ? 'rgba(255, 0, 0, 0.1)' : undefined,
          borderColor: isFollowing ? 'error.main' : undefined,
          color: isFollowing ? 'error.main' : undefined,
          '& span': {
            display: isFollowing ? 'none' : 'inline',
          },
          '&::after': {
            content: isFollowing ? '"Dejar de seguir"' : '""',
          },
        },
      }}
    >
      <span>{isFollowing ? 'Siguiendo' : 'Seguir'}</span>
    </Button>
  )
}
