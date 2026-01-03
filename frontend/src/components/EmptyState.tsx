import { Box, Typography } from '@mui/material'

export const EmptyState = ({ message }: { message?: string }) => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant='body2' color='text.secondary'>
      {message || 'No existen resultados.'}
    </Typography>
  </Box>
)
