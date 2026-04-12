import { useState } from 'react'
import { Box, Button, Stack, Paper, useTheme } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { User } from 'social-network-app-shared/types/auth.type'
import { FollowButton } from './FollowButton'
import { ImageModal } from '@/components/common/ImageModal'
import { OptimizedAvatar } from '@/components/common/OptimizedAvatar'

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
  const [imageModalOpen, setImageModalOpen] = useState(false)

  return (
    <Paper
      elevation={0}
      variant='outlined'
      sx={{
        border: 0,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: theme.tokens.borderRadius.none,
      }}
    >
      <Box sx={{ height: 180, bgcolor: 'primary.main', opacity: 0.8 }} />
      <Box sx={{ px: { xs: 2, sm: 4 }, pb: 2, position: 'relative' }}>
        <Box
          onClick={() => user?.avatar && setImageModalOpen(true)}
          sx={{
            position: 'absolute',
            top: -60,
            cursor: user?.avatar ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: user?.avatar ? 'scale(1.05)' : 'none',
            },
          }}
        >
          <OptimizedAvatar
            src={user?.avatar}
            alt={user?.name}
            size={120}
            lazy={false}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          {isOwnProfile ? (
            <Button
              variant='outlined'
              startIcon={<EditIcon />}
              sx={{ borderRadius: theme.tokens.borderRadius.xl }}
              onClick={onEditClick}
            >
              Editar Perfil
            </Button>
          ) : (
            <Stack direction='row' spacing={1}>
              <FollowButton userId={user?.id || ''} />
              <Button
                variant='outlined'
                sx={{ borderRadius: theme.tokens.borderRadius.xl }}
              >
                Mensaje
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      {user?.avatar && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={user.avatar}
          altText={`Foto de perfil de ${user.name}`}
        />
      )}
    </Paper>
  )
}
