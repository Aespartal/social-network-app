import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
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

// Piezas Atómicas
import { PostImagePreview } from './parts'

// Estilos
import { getCreatePostStyles } from './CreatePost.styles'

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
  const [isWriting, setIsWriting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const isNearLimit = MAX_CHARS - charCount <= 20

  const styles = getCreatePostStyles(theme, isWriting)

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
      handleInternalClose()
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
      sx={styles.dialog}
    >
      <DialogTitle sx={styles.title}>
        <Typography variant='subtitle1' sx={styles.titleText}>
          {parentPost ? 'Responder' : 'Aura Composer'}
        </Typography>
        <IconButton
          onClick={handleInternalClose}
          disabled={loading}
          size='small'
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={styles.content}>
        {/* Contexto de respuesta */}
        {parentPost && <ParentPostContext post={parentPost} />}

        <Box sx={styles.inputLayout}>
          <OptimizedAvatar src={user?.avatar} alt={user?.name} size='lg' />
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              placeholder={
                parentPost ? 'Postea tu respuesta...' : 'Comparte tu aura...'
              }
              variant='standard'
              value={content}
              onChange={e => setContent(e.target.value)}
              onFocus={() => setIsWriting(true)}
              onBlur={() => setIsWriting(false)}
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: styles.textField['& .MuiInputBase-root'],
              }}
            />

            {/* Previsualización de Imagen (Componente Atómico) */}
            {previewUrl && (
              <PostImagePreview
                url={previewUrl}
                onRemove={handleRemoveImage}
                loading={loading}
                styles={styles}
              />
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={styles.footer}>
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
              sx={styles.charCount(isOverLimit, isNearLimit)}
            >
              {MAX_CHARS - charCount}
            </Typography>
          )}

          <Button
            onClick={handleSaveClick}
            disabled={
              loading || (!content.trim() && !selectedFile) || isOverLimit
            }
            sx={styles.submitButton}
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

/**
 * Contexto del post padre (Mantenido internamente por simplicidad visual en el modal)
 */
const ParentPostContext = ({ post }: { post: Post }) => (
  <Box
    sx={{
      mb: 3,
      p: 2,
      bgcolor: 'action.hover',
      borderRadius: '16px',
      border: '1px solid divider',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <OptimizedAvatar
        src={post.author.avatar}
        alt={post.author.name}
        size='xs'
      />
      <Typography variant='caption' fontWeight={700} color='text.secondary'>
        En respuesta a @{post.author.username}
      </Typography>
    </Box>
    <Typography
      variant='body2'
      sx={{
        fontFamily: 'Lora, serif',
        fontStyle: 'italic',
        opacity: 0.7,
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      "{post.content}"
    </Typography>
  </Box>
)
