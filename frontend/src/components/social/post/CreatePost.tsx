import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import PhotoIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '../../ui'
import { useAuth } from '@/hooks/useAuth'
import { Post } from 'social-network-app-shared/types/social.type'
import { useState, useRef, useEffect } from 'react'

export interface CreatePostDialogProps {
  open: boolean
  onClose: () => void
  content: string
  setContent: (content: string) => void
  onSave: (content: string, imageFile?: File) => Promise<void> | void
  loading: boolean
  parentPost?: Post | null
}

const MAX_CHARS = 280
const MAX_FILE_SIZE_MB = 5

export const CreatePostDialog = ({
  open,
  onClose,
  content,
  setContent,
  onSave,
  loading,
  parentPost,
}: CreatePostDialogProps) => {
  const { user } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Limpieza de memoria: Revocar la URL del objeto para evitar memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (file) {
      // Validación de tamaño
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`La imagen excede los ${MAX_FILE_SIZE_MB}MB`)
        return
      }

      // Validación de tipo básica
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen')
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (loading) return

    const hasContent = content.trim().length > 0
    const hasImage = !!selectedFile
    const isOverLimit = content.length > MAX_CHARS

    if (!hasContent && !hasImage) return
    if (isOverLimit) return

    try {
      await onSave(content, selectedFile || undefined)
    } catch {
      setError('Error al publicar. Inténtalo de nuevo.')
    }
  }

  const handleOnClose = () => {
    if (loading) return
    removeImage()
    setError(null)
    onClose()
  }

  const remainingChars = MAX_CHARS - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 20 && remainingChars >= 0

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      fullWidth
      maxWidth={parentPost ? 'sm' : 'md'}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          p: 0,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant='h6' fontWeight='bold'>
          {parentPost ? 'Responder' : 'Nueva publicación'}
        </Typography>
        {!loading && (
          <IconButton
            onClick={handleOnClose}
            size='small'
            aria-label='Cerrar diálogo'
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 2 }}>
        {parentPost && (
          <Box
            sx={{
              mb: 2,
              pl: 1,
              borderLeft: 4,
              borderColor: 'primary.main',
              opacity: 0.8,
            }}
          >
            <Typography
              variant='caption'
              color='text.secondary'
              display='block'
              sx={{ mb: 0.5 }}
            >
              Respondiendo a{' '}
              <span style={{ color: theme.palette.primary.main }}>
                @{parentPost.author.username}
              </span>
            </Typography>
            <Typography variant='body2' color='text.primary' noWrap>
              {parentPost.content}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.avatar || ''}
            sx={{ width: 48, height: 48 }}
            alt={user?.name}
          />
          <Box flex={1}>
            <Typography variant='subtitle1' fontWeight='bold'>
              {user?.name || 'Usuario'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {parentPost
                ? 'Respuesta pública'
                : 'Cualquier persona puede responder'}
            </Typography>
          </Box>
        </Box>

        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          variant='standard'
          placeholder={
            parentPost ? 'Postea tu respuesta' : '¿Qué está pasando?'
          }
          value={content}
          onChange={e => {
            setContent(e.target.value)
            if (error) setError(null)
          }}
          disabled={loading}
          inputProps={{ maxLength: MAX_CHARS + 50 }}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '1.25rem',
              lineHeight: 1.5,
              color: 'text.primary',
              '&::placeholder': {
                color: 'text.disabled',
                opacity: 0.7,
              },
            },
          }}
        />

        {/* Preview de Imagen */}
        {previewUrl && (
          <Box
            sx={{
              position: 'relative',
              mt: 2,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              maxWidth: '100%',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <IconButton
                onClick={removeImage}
                disabled={loading}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
                size='small'
                aria-label='Eliminar imagen'
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
            <img
              src={previewUrl}
              alt='Vista previa'
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain',
                display: 'block',
                backgroundColor: '#000',
              }}
            />
          </Box>
        )}

        {/* Mensajes de error o contador */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          {error && (
            <Typography variant='caption' color='error.main'>
              {error}
            </Typography>
          )}
          {!error && (
            <Typography
              variant='caption'
              sx={{
                fontWeight: isOverLimit ? 'bold' : 'normal',
                color: isOverLimit
                  ? 'error.main'
                  : isNearLimit
                    ? 'warning.main'
                    : 'text.secondary',
                transition: 'color 0.2s',
              }}
            >
              {content.length} / {MAX_CHARS}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box>
          <input
            type='file'
            accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading || !!selectedFile}
          />
          <IconButton
            color='primary'
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || !!selectedFile}
            aria-label='Añadir imagen'
          >
            <PhotoIcon />
          </IconButton>
        </Box>

        <Button
          onClick={handleSave}
          variant='primary'
          disabled={
            loading || (!content.trim() && !selectedFile) || isOverLimit
          }
          sx={{
            px: 4,
            py: 1,
            borderRadius: 5,
            minWidth: 100,
          }}
        >
          {loading ? 'Publicando...' : parentPost ? 'Responder' : 'Publicar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
