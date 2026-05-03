import React from 'react'
import { Box as MuiBox, Container, Stack, useTheme, alpha } from '@mui/material'
import { Box, Text as Typography, Button } from '@/components/ui'
import { motion } from 'framer-motion'
import { AuraNode } from '@/services/node.service'

interface NodeHeroProps {
  node: AuraNode
  isAuthenticated: boolean
  tuning: boolean
  onTuneIn: () => void
}

export const NodeHero: React.FC<NodeHeroProps> = ({
  node,
  isAuthenticated,
  tuning,
  onTuneIn,
}) => {
  const theme = useTheme()
  const nodeColor = node.color || theme.palette.primary.main

  return (
    <MuiBox
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
        px: 3,
        mb: 4,
        overflow: 'hidden',
        borderBottom: `1px solid ${alpha(nodeColor, 0.2)}`,
        background: `linear-gradient(180deg, ${alpha(nodeColor, 0.05)} 0%, ${alpha(
          theme.palette.background.default,
          1
        )} 100%)`,
      }}
    >
      {/* Abstract Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: '20%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(nodeColor, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0,
          animation:
            node.pulse > 5
              ? 'pulse-fast 3s infinite alternate'
              : 'pulse-slow 8s infinite alternate',
          '@keyframes pulse-slow': {
            '0%': { transform: 'scale(1)', opacity: 0.3 },
            '100%': { transform: 'scale(1.2)', opacity: 0.6 },
          },
          '@keyframes pulse-fast': {
            '0%': { transform: 'scale(1)', opacity: 0.5 },
            '100%': { transform: 'scale(1.3)', opacity: 0.9 },
          },
        }}
      />

      <Container maxWidth='md' sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' spacing={3} alignItems='center'>
            <MuiBox
              component={motion.div}
              animate={node.pulse > 5 ? { y: [0, -5, 0] } : {}}
              transition={
                node.pulse > 5
                  ? ({
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    } as any)
                  : {}
              }
              sx={{
                width: 80,
                height: 80,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                backgroundColor: alpha(nodeColor, 0.1),
                border: `1px solid ${alpha(nodeColor, 0.3)}`,
                boxShadow: `0 8px 32px ${alpha(nodeColor, 0.2)}`,
              }}
            >
              {node.icon ||
                (node.name ? node.name.charAt(0).toUpperCase() : '?')}
            </MuiBox>
            <Box>
              <Typography
                variant='h3'
                sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}
              >
                {node.name}
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ maxWidth: 400 }}
              >
                {node.description}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Button
              variant={node.isTuned ? 'outlined' : 'primary'}
              onClick={onTuneIn}
              disabled={tuning || !isAuthenticated}
              sx={{
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                borderColor: node.isTuned ? nodeColor : 'transparent',
                color: node.isTuned ? nodeColor : undefined,
                backgroundColor: node.isTuned ? 'transparent' : nodeColor,
                '&:hover': {
                  backgroundColor: node.isTuned
                    ? alpha(nodeColor, 0.1)
                    : alpha(nodeColor, 0.8),
                  borderColor: nodeColor,
                },
              }}
            >
              {tuning
                ? 'Procesando...'
                : node.isTuned
                  ? 'Sintonizado'
                  : 'Sintonizar'}
            </Button>

            <Stack direction='row' spacing={3}>
              <Box>
                <Typography
                  variant='caption'
                  sx={{
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    fontWeight: 700,
                  }}
                >
                  Vibración
                </Typography>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, color: nodeColor }}
                >
                  {Math.round(Number(node.vibration) || 0)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant='caption'
                  sx={{
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    fontWeight: 700,
                  }}
                >
                  Pulso
                </Typography>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, color: nodeColor }}
                >
                  {node.pulse > 5 ? 'Alto ⚡' : 'Estable'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </MuiBox>
  )
}
