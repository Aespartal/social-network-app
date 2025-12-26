import { useState } from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CreatePostDialog } from './CreatePost';

interface CreatePostActionProps {
  onSave: (content: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export const CreatePostAction = ({ onSave, loading }: CreatePostActionProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleSave = async (text: string) => {
    const result = await onSave(text);
    if (result.success) {
      setOpen(false);
      setContent('');
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: { xs: 80, sm: 20 }, right: 20 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <CreatePostDialog
        open={open}
        onClose={() => setOpen(false)}
        content={content}
        setContent={setContent}
        onSave={handleSave}
        loading={loading}
      />
    </>
  );
};