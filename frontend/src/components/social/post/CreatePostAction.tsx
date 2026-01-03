import { useState } from 'react'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { CreatePostDialog } from './CreatePost'
import { Post } from 'social-network-app-shared/types/social.type'

interface CreatePostActionProps {
  onSave: (content: string, parentId?: string) => Promise<{ success: boolean }>
  loading: boolean
  replyToPost?: Post | null
  onCloseReply: () => void
}

export const CreatePostAction = ({
  onSave,
  loading,
  replyToPost,
  onCloseReply,
}: CreatePostActionProps) => {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')

  const isDialogOpen = open || !!replyToPost

  const handleSave = async (text: string) => {
    const result = await onSave(text, replyToPost?.id)
    if (result.success) {
      handleClose()
    }
  }

  const handleClose = () => {
    setOpen(false)
    setContent('')
    onCloseReply()
  }

  return (
    <>
      {/* Ocultamos el botón flotante si ya hay un diálogo de respuesta abierto */}
      {!replyToPost && (
        <Fab
          color='primary'
          sx={{ position: 'fixed', bottom: { xs: 80, sm: 20 }, right: 20 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      <CreatePostDialog
        open={isDialogOpen} // Usamos nuestra variable derivada
        onClose={handleClose}
        content={content}
        setContent={setContent}
        onSave={handleSave}
        loading={loading}
        parentPost={replyToPost}
      />
    </>
  )
}
