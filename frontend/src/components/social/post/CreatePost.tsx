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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '../../ui'
import { useAuth } from '@/hooks/useAuth'
import { Post } from 'social-network-app-shared/types/social.type'

export interface CreatePostDialogProps {
  open: boolean
  onClose: () => void
  content: string
  setContent: (content: string) => void
  onSave: (content: string) => Promise<void> | void
  loading: boolean
  parentPost?: Post | null
}

const MAX_CHARS = 280

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

  const handleSave = () => {
    if (!loading && content.trim() && content.length <= MAX_CHARS) {
      onSave(content)
    }
  }

  const isOverLimit = content.length > MAX_CHARS

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth='xs'
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='h6' fontWeight='bold'>
          {parentPost ? 'Responder post' : 'Crear publicación'}
        </Typography>
        {!loading && (
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Visual de a quién respondes (opcional, estilo Twitter) */}
        {parentPost && (
          <Box sx={{ mb: 2, opacity: 0.7 }}>
            <Typography variant='caption' color='primary'>
              Respondiendo a @{parentPost.author.username}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar src={user?.avatar || ''} sx={{ width: 40, height: 40 }} />
          <Box flex={1}>
            <Typography variant='subtitle2' fontWeight='bold'>
              {user?.name || 'Usuario'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {parentPost
                ? 'Cualquier persona puede responder'
                : 'Publicación pública'}
            </Typography>
          </Box>
        </Box>

        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          variant='standard'
          placeholder={
            parentPost ? 'Postea tu respuesta' : '¿Qué está pasando?'
          }
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: '1.2rem', lineHeight: 1.4 },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Typography
            variant='caption'
            color={isOverLimit ? 'error.main' : 'text.secondary'}
          >
            {content.length} / {MAX_CHARS}
          </Typography>
        </Box>
      </DialogContent>

      <Divider sx={{ mx: 2 }} />

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleSave}
          variant='primary'
          disabled={loading || !content.trim() || isOverLimit}
          sx={{ px: 4, borderRadius: 5 }}
        >
          {loading ? 'Publicando...' : parentPost ? 'Responder' : 'Postear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
