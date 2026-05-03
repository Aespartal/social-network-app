import { useState } from 'react'
import { Box, Button, Stack, Text as Typography } from '@/components/ui'
import { alpha, useTheme, CircularProgress } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { User } from 'social-network-app-shared/types/auth.type'
import { FollowButton } from './FollowButton'
import { ImageModal } from '@/components/common/ImageModal'
import { OptimizedAvatar } from '@/components/common/OptimizedAvatar'
import { LevelBadge } from '@/components/common/LevelBadge'
import { useUserLevel } from '@/hooks/useUserLevel'
import { useAuth } from '@/hooks'
import { getLevelColor } from '@/constants/levels'

interface ProfileHeaderProps {
  user: User | null
  isOwnProfile: boolean
  onEditClick?: () => void
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditClick,
}: ProfileHeaderProps) => {
  const theme = useTheme()
  const { isAuthenticated } = useAuth()
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const { levelInfo, loading } = useUserLevel(user?.id)

  const auraColor = levelInfo
    ? getLevelColor(levelInfo.level)
    : theme.palette.primary.main

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* 1. Fondo Aura (Biofílico) */}
      <Box
        sx={{
          height: '240px',
          background: `radial-gradient(circle at 50% 120%, ${alpha(auraColor, 0.2)}, transparent 70%)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Micro-animación de Aura */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(auraColor, 0.1)} 0%, transparent 70%)`,
            animation: 'pulse 8s infinite ease-in-out',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1) translate(0, 0)',
                opacity: 0.5,
              },
              '50%': {
                transform: 'scale(1.2) translate(10px, -20px)',
                opacity: 0.8,
              },
            },
          }}
        />
      </Box>

      {/* 2. Avatar Flotante Centrado */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: -7,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          onClick={() => user?.avatar && setImageModalOpen(true)}
          sx={{
            position: 'relative',
            cursor: user?.avatar ? 'pointer' : 'default',
            p: 1,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(auraColor, 0.4)}, transparent)`,
            boxShadow: `0 0 30px ${alpha(auraColor, 0.2)}`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'scale(1.05) translateY(-5px)',
              boxShadow: `0 10px 40px ${alpha(auraColor, 0.3)}`,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={120} />
          ) : (
            <Box sx={{ position: 'relative' }}>
              <OptimizedAvatar
                src={user?.avatar}
                alt={user?.name}
                size={120}
                lazy={false}
                sx={{ border: `4px solid ${theme.palette.background.default}` }}
              />
              {levelInfo && (
                <Box sx={{ position: 'absolute', bottom: -5, right: -5 }}>
                  <LevelBadge level={levelInfo.level} size='large' />
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* 3. Nombre e Info Centrada */}
        <Stack spacing={0.5} alignItems='center' sx={{ mt: 2 }}>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 800,
              fontFamily: theme.typography.h1.fontFamily,
              letterSpacing: '-0.02em',
            }}
          >
            {user?.name}
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ opacity: 0.7 }}
          >
            @{user?.username}
          </Typography>
        </Stack>

        {/* 4. Acciones (Píldoras Minimalistas) */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {isOwnProfile ? (
            <Button
              variant='outline'
              startIcon={<EditIcon sx={{ fontSize: '1.2rem' }} />}
              onClick={onEditClick}
              sx={{ borderRadius: '50px', px: 4, py: 1, fontWeight: 700 }}
            >
              Ajustar mi Aura
            </Button>
          ) : (
            <Stack direction='row' spacing={2}>
              <FollowButton userId={user?.id || ''} />
              {isAuthenticated && user && !isOwnProfile && (
                <Button
                  variant='outline'
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1,
                    fontWeight: 700,
                  }}
                >
                  Conectar
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Box>

      {user?.avatar && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={user.avatar}
          altText={`Aura de ${user.name}`}
        />
      )}
    </Box>
  )
}
