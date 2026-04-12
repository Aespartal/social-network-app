import React from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { SearchBar } from './SearchBar'
import { SuggestedUsers } from '@/components/social/profile/SuggestedUsers'

/**
 * Componente para la columna lateral derecha (Descubrimiento)
 */
export const HomeSidebar: React.FC = () => (
  <Stack
    spacing={3}
    sx={{
      position: 'sticky',
      top: 12,
      height: 'fit-content',
    }}
  >
    <SearchBar />
    <SuggestedUsers />

    <Box sx={{ px: 2 }}>
      <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
        {['Privacidad', 'Condiciones', 'Publicidad', 'Información', 'Más'].map(
          item => (
            <Typography
              key={item}
              variant='caption'
              color='text.secondary'
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {item}
            </Typography>
          )
        )}
      </Stack>
      <Typography
        variant='caption'
        color='text.disabled'
        display='block'
        sx={{ mt: 2 }}
      >
        © 2026 SocialNetwork App
      </Typography>
    </Box>
  </Stack>
)
