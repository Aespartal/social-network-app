import { useState, useRef, useEffect } from 'react'
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
  CircularProgress,
} from '@mui/material'
import PhotoIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '../../ui'
import { useAuth } from '@/hooks/useAuth'
import { Post } from 'social-network-app-shared/types/social.type'
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_CHARS,
  MAX_FILE_SIZE_MB,
} from './constants/posts'

export interface CreatePostDialogProps {
  open: boolean
  onClose: () => void
  content: string
  setContent: (content: string) => void
  onSave: (content: string, imageFile?: File) => Promise<void> | void
  loading: boolean
  parentPost?: Post | null
}

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const isNearLimit = MAX_CHARS - charCount <= 20

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`La imagen excede los ${MAX_FILE_SIZE_MB}MB`)
      return
    }

    setError(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleInternalClose = () => {
    if (loading) return
    handleRemoveImage()
    setError(null)
    onClose()
  }

  const handleSaveClick = async () => {
    if (!content.trim() && !selectedFile) return
    try {
      await onSave(content, selectedFile || undefined)
      handleInternalClose() // Limpiar tras éxito
    } catch {
      setError('No se pudo publicar. Inténtalo de nuevo.')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleInternalClose}
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
        <Typography variant='subtitle1' fontWeight={800}>
          {parentPost ? 'Responder' : 'Nueva publicación'}
        </Typography>
        <IconButton
          onClick={handleInternalClose}
          disabled={loading}
          size='small'
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        {/* Contexto de respuesta */}
        {parentPost && <ParentPostContext post={parentPost} />}

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar src={user?.avatar || ''} sx={{ width: 48, height: 48 }} />
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              placeholder={
                parentPost ? 'Postea tu respuesta' : '¿Qué está pasando?'
              }
              variant='standard'
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '1.2rem', lineHeight: 1.4, mt: 0.5 },
              }}
            />

            {/* Previsualización de Imagen */}
            {previewUrl && (
              <ImagePreview
                url={previewUrl}
                onRemove={handleRemoveImage}
                loading={loading}
              />
            )}
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <DialogActions sx={{ px: 3, py: 1.5, justifyContent: 'space-between' }}>
        <Box>
          <input
            type='file'
            accept={ACCEPTED_IMAGE_TYPES}
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <IconButton
            color='primary'
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || !!selectedFile}
          >
            <PhotoIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {charCount > 0 && (
            <Typography
              variant='caption'
              color={
                isOverLimit
                  ? 'error'
                  : isNearLimit
                    ? 'warning.main'
                    : 'text.secondary'
              }
              sx={{ fontWeight: isNearLimit ? 700 : 400 }}
            >
              {MAX_CHARS - charCount}
            </Typography>
          )}

          <Button
            onClick={handleSaveClick}
            disabled={
              loading || (!content.trim() && !selectedFile) || isOverLimit
            }
            sx={{ borderRadius: 8, px: 3, fontWeight: 700 }}
          >
            {loading ? (
              <CircularProgress size={20} color='inherit' />
            ) : parentPost ? (
              'Responder'
            ) : (
              'Publicar'
            )}
          </Button>
        </Box>
      </DialogActions>

      {error && (
        <Typography color='error' variant='caption' sx={{ px: 3, pb: 1 }}>
          {error}
        </Typography>
      )}
    </Dialog>
  )
}

const ParentPostContext = ({ post }: { post: Post }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Avatar src={post.author.avatar || ''} sx={{ width: 48, height: 48 }} />
      <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', my: 1 }} />
    </Box>
    <Box sx={{ pt: 0.5 }}>
      <Typography variant='subtitle2' fontWeight={700}>
        @{post.author.username}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
        {post.content}
      </Typography>
    </Box>
  </Box>
)

const ImagePreview = ({
  url,
  onRemove,
  loading,
}: {
  url: string
  onRemove: () => void
  loading: boolean
}) => (
  <Box
    sx={{
      mt: 2,
      position: 'relative',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <IconButton
      onClick={onRemove}
      disabled={loading}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        bgcolor: 'rgba(0,0,0,0.7)',
        color: 'white',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
      }}
      size='small'
    >
      <CloseIcon fontSize='small' />
    </IconButton>
    <img
      src={url}
      alt='Preview'
      style={{
        width: '100%',
        maxHeight: 350,
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </Box>
)
