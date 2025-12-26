import { Box, Typography, Button, Paper, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export const AuthPlaceholder = () => {
  const navigate = useNavigate()

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='70vh'
      textAlign='center'
      px={2}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          bgcolor: 'transparent',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          maxWidth: 400,
        }}
      >
        <Typography variant='h4' fontWeight='800' gutterBottom color='primary'>
          SocialNetwork
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          Únete a la conversación. Inicia sesión para ver las últimas
          publicaciones de tus amigos y comunidades.
        </Typography>

        <Stack direction='row' spacing={2} justifyContent='center'>
          <Button
            variant='contained'
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 2 }}
          >
            Entrar
          </Button>
          <Button
            variant='outlined'
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            sx={{ borderRadius: 2 }}
          >
            Registrarse
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
