import React from 'react'
import { Box, Text as Typography, Button } from '@/components/ui'
import { Stack, Skeleton } from '@mui/material'
import { useAuraNodes } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { NodeListItem } from './parts/NodeListItem'

export const NodeList: React.FC = () => {
  const navigate = useNavigate()
  const { trendingNodes, loading } = useAuraNodes()

  const handleNodeClick = (slug: string) => {
    navigate(`/nodes/${encodeURIComponent(slug)}`)
  }

  const renderSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map(i => (
        <Skeleton
          key={i}
          variant='rectangular'
          height={80}
          sx={{ borderRadius: '24px' }}
        />
      ))}
    </Stack>
  )

  return (
    <Box sx={{ px: 1 }}>
      <Typography
        variant='subtitle1'
        sx={{
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          mb: 2,
          ml: 1,
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}
      >
        Nodos Aura
      </Typography>

      {loading && renderSkeleton()}

      {!loading &&
        trendingNodes.map(node => (
          <NodeListItem key={node.id} node={node} onClick={handleNodeClick} />
        ))}

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Button
          variant='ghost'
          size='small'
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.6,
            '&:hover': { color: 'primary.main', opacity: 1 },
          }}
        >
          Ver mapa de sintonía
        </Button>
      </Box>
    </Box>
  )
}
