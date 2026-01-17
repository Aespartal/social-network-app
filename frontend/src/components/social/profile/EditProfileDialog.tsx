import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Avatar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Badge,
} from '@mui/material'
import {
  Close as CloseIcon,
  CameraAlt as CameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Button } from '../../ui'
import { User } from 'social-network-app-shared/types/auth.type'

const MAX_USERNAME_LENGTH = 20
const MAX_BIO_LENGTH = 160
const MAX_NAME_LENGTH = 50
const MAX_FILE_SIZE_MB = 5
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

interface EditProfileDialogProps {
  open: boolean
  onClose: () => void
  user: User
  onSave: (data: {
    username?: string
    name?: string
    bio?: string
    avatarFile?: File
  }) => Promise<void>
  loading: boolean
}

export const EditProfileDialog = ({
  open,
  onClose,
  user,
  onSave,
  loading,
}: EditProfileDialogProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Reset states to initial values
      const resetStates = () => {
        setUsername(user.username)
        setName(user.name)
        setBio(user.bio || '')
        setAvatarFile(null)
        setAvatarPreview(null)
        setError(null)
      }
      resetStates()
    }
  }, [open]) // Removed user from deps to avoid cascading renders

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Formato de imagen no válido. Usa JPG, PNG, GIF o WebP')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`La imagen excede los ${MAX_FILE_SIZE_MB}MB`)
      return
    }

    setError(null)
    setAvatarFile(file)

    // Limpiar preview anterior
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    if (loading) return

    const updates: {
      username?: string
      name?: string
      bio?: string
      avatarFile?: File
    } = {}

    if (username !== user.username) updates.username = username
    if (name !== user.name) updates.name = name
    if (bio !== user.bio) updates.bio = bio
    if (avatarFile) updates.avatarFile = avatarFile

    if (Object.keys(updates).length === 0) {
      onClose()
      return
    }

    try {
      await onSave(updates)
      onClose()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Error al actualizar el perfil')
    }
  }

  const currentAvatar = avatarPreview || user.avatar || ''
  const hasChanges =
    username !== user.username ||
    name !== user.name ||
    bio !== (user.bio || '') ||
    avatarFile !== null

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth='sm'
      fullScreen={isMobile}
      PaperProps={{
        sx: { borderRadius: isMobile ? 0 : 3, backgroundImage: 'none' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
        }}
      >
        <Typography variant='h6' fontWeight={700}>
          Editar perfil
        </Typography>
        <IconButton onClick={onClose} disabled={loading} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Stack direction='row' spacing={0.5}>
                  <IconButton
                    onClick={handleAvatarClick}
                    disabled={loading}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <CameraIcon fontSize='small' />
                  </IconButton>
                  {avatarPreview && (
                    <IconButton
                      onClick={handleRemoveAvatar}
                      disabled={loading}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  )}
                </Stack>
              }
            >
              <Avatar
                src={currentAvatar}
                sx={{
                  width: 120,
                  height: 120,
                  border: 4,
                  borderColor: 'background.paper',
                  boxShadow: 3,
                }}
              />
            </Badge>
            <input
              ref={fileInputRef}
              type='file'
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Box>

          {error && (
            <Typography color='error' variant='body2' textAlign='center'>
              {error}
            </Typography>
          )}

          {/* Nombre de usuario */}
          <TextField
            fullWidth
            label='Nombre de usuario'
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            inputProps={{ maxLength: MAX_USERNAME_LENGTH }}
            helperText={`${username.length}/${MAX_USERNAME_LENGTH}`}
          />

          {/* Nombre */}
          <TextField
            fullWidth
            label='Nombre'
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            inputProps={{ maxLength: MAX_NAME_LENGTH }}
            helperText={`${name.length}/${MAX_NAME_LENGTH}`}
          />

          {/* Biografía */}
          <TextField
            fullWidth
            label='Biografía'
            multiline
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={loading}
            inputProps={{ maxLength: MAX_BIO_LENGTH }}
            helperText={`${bio.length}/${MAX_BIO_LENGTH}`}
            placeholder='Cuéntanos sobre ti...'
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color='inherit'>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          loading={loading}
          disabled={!hasChanges || loading || !username.trim() || !name.trim()}
          variant='primary'
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  )
}
