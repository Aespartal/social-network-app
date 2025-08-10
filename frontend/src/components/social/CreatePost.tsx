import React, { useState, useRef } from 'react'
import { Box, Typography, Avatar, IconButton, Chip, Stack } from '@mui/material'
import {
  PhotoCamera as PhotoIcon,
  EmojiEmotions as EmojiIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { Card, CardContent, Button, Textarea } from '@/components/ui'

export interface CreatePostProps {
  user: {
    name: string
    username: string
    avatar: string
  }
  onPost: (content: string, image?: File, tags?: string[]) => void
  placeholder?: string
}

export const CreatePost: React.FC<CreatePostProps> = ({
  user,
  onPost,
  placeholder = '¿Qué está pasando?',
}) => {
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = e => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handlePost()
    }
  }

  const handlePost = () => {
    if (content.trim() || selectedImage) {
      onPost(
        content.trim(),
        selectedImage || undefined,
        tags.length > 0 ? tags : undefined
      )

      // Reset form
      setContent('')
      setSelectedImage(null)
      setImagePreview(null)
      setTags([])
      setCurrentTag('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const isPostDisabled = !content.trim() && !selectedImage

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 40, height: 40 }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Textarea
              placeholder={placeholder}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              onKeyPress={handleKeyPress}
              rows={3}
              variant='standard'
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.1rem',
                  '&:before, &:after': {
                    display: 'none',
                  },
                },
              }}
            />

            {/* Image Preview */}
            {imagePreview && (
              <Box
                sx={{ mt: 2, position: 'relative', display: 'inline-block' }}
              >
                <Box
                  component='img'
                  src={imagePreview}
                  alt='Preview'
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                  size='small'
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Stack direction='row' spacing={0.5} flexWrap='wrap'>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size='small'
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Add Tag Input */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box
                component='input'
                type='text'
                placeholder='Agregar tag...'
                value={currentTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTag(e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                sx={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  padding: '4px 8px',
                  borderRadius: 1,
                  backgroundColor: 'grey.100',
                  flexGrow: 1,
                  maxWidth: 120,
                }}
              />
              {currentTag.trim() && (
                <Button variant='ghost' size='sm' onClick={handleAddTag}>
                  Agregar
                </Button>
              )}
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  color='primary'
                  size='small'
                >
                  <PhotoIcon />
                </IconButton>
                <IconButton color='primary' size='small'>
                  <EmojiIcon />
                </IconButton>
                <IconButton color='primary' size='small'>
                  <LocationIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  color={content.length > 280 ? 'error' : 'text.secondary'}
                >
                  {280 - content.length}
                </Typography>
                <Button
                  variant='primary'
                  size='sm'
                  onClick={handlePost}
                  disabled={isPostDisabled || content.length > 280}
                >
                  Publicar
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
