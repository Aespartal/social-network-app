import React from 'react'
import { Box, Text as Typography } from '@/components/ui'
import { alpha, useTheme, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { AuraNode } from '@/services/node.service'

interface NodeListItemProps {
  node: AuraNode
  onClick: (slug: string) => void
}

export const NodeListItem: React.FC<NodeListItemProps> = ({
  node,
  onClick,
}) => {
  const theme = useTheme()

  const nodeStyle = {
    padding: theme.spacing(2),
    borderRadius: '24px',
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(15px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    mb: 2,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      borderColor: theme.palette.primary.main,
      boxShadow:
        theme.palette.mode === 'dark'
          ? `0 12px 24px rgba(0, 0, 0, 0.3)`
          : `0 12px 24px rgba(0, 0, 0, 0.05)`,
    },
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(node.slug)}
    >
      <Box sx={nodeStyle}>
        {/* Indicador de Pulso (Vibración) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${Math.min(node.vibration, 100)}%`,
            height: '2px',
            bgcolor: node.color || theme.palette.primary.main,
            opacity: 0.3,
          }}
        />

        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography sx={{ fontSize: '1.2rem' }}>
            {node.icon || (node.name ? node.name.charAt(0).toUpperCase() : '?')}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: node.color || theme.palette.text.primary,
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            #{node.slug}
          </Typography>
        </Stack>

        <Typography
          variant='caption'
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
            fontWeight: 700,
            opacity: 0.5,
            mt: 0.5,
          }}
        >
          Vibración:{' '}
          {node.vibration > 70
            ? 'Alta'
            : node.vibration > 30
              ? 'Media'
              : 'Estable'}
        </Typography>

        {/* Micro-animación de Pulso */}
        {node.pulse > 5 && (
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: node.color || theme.palette.primary.main,
              boxShadow: `0 0 10px ${node.color || theme.palette.primary.main}`,
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'translateY(-50%) scale(1)', opacity: 0.8 },
                '50%': {
                  transform: 'translateY(-50%) scale(1.5)',
                  opacity: 0.4,
                },
                '100%': {
                  transform: 'translateY(-50%) scale(1)',
                  opacity: 0.8,
                },
              },
            }}
          />
        )}
      </Box>
    </motion.div>
  )
}
