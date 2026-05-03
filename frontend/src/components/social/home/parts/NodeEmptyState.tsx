import React from 'react'
import { Text as Typography } from '@/components/ui'
import { Box, alpha, useTheme, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { AuraNode } from '@/services/node.service'

interface NodeEmptyStateProps {
  node: AuraNode
}

export const NodeEmptyState: React.FC<NodeEmptyStateProps> = ({ node }) => {
  const theme = useTheme()
  const nodeColor = node.color || theme.palette.primary.main

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: '24px',
        backgroundColor: alpha(nodeColor, 0.05),
        border: `1px dashed ${alpha(nodeColor, 0.3)}`,
      }}
    >
      <Typography
        variant='body1'
        color='text.secondary'
        sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}
      >
        Aún no hay publicaciones en este nodo. ¡Sé el primero en crear contenido
        y darle vida!
      </Typography>
      <Button
        variant='contained'
        onClick={() => document.getElementById('create-post-fab')?.click()}
        sx={{
          borderRadius: '50px',
          px: 4,
          py: 1.5,
          fontWeight: 700,
          textTransform: 'none',
          bgcolor: nodeColor,
          color: theme.palette.getContrastText(nodeColor),
          boxShadow: `0 4px 14px ${alpha(nodeColor, 0.4)}`,
          '&:hover': {
            bgcolor: alpha(nodeColor, 0.8),
            boxShadow: `0 6px 20px ${alpha(nodeColor, 0.6)}`,
          },
        }}
      >
        Crear primera publicación
      </Button>
    </Box>
  )
}
