import { Box, Avatar, Button, Stack, Paper } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { User } from 'social-network-app-shared/types/auth.type'

interface ProfileHeaderProps {
  user: User | null
  isOwnProfile: boolean
}

export const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => (
  <Paper
    elevation={0}
    variant='outlined'
    sx={{ border: 0, overflow: 'hidden', position: 'relative' }}
  >
    
    <Box sx={{ height: 180, bgcolor: 'primary.main', opacity: 0.8 }} />
    <Box sx={{ px: { xs: 2, sm: 4 }, pb: 2, position: 'relative' }}>
      <Avatar
        src={user?.avatar || ''}
        sx={{
          width: 120,
          height: 120,
          border: '4px solid white',
          borderColor: 'background.paper',
          position: 'absolute',
          top: -60,
          boxShadow: 3,
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
        {isOwnProfile ? (
          <Button
            variant='outlined'
            startIcon={<EditIcon />}
            sx={{ borderRadius: 20 }}
          >
            Editar Perfil
          </Button>
        ) : (
          <Stack direction='row' spacing={1}>
            <Button variant='contained' sx={{ borderRadius: 20, px: 4 }}>
              Seguir
            </Button>
            <Button variant='outlined' sx={{ borderRadius: 20 }}>
              Mensaje
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  </Paper>
)
