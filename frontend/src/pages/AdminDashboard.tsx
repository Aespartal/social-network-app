import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ShieldIcon from '@mui/icons-material/Shield'
import PeopleIcon from '@mui/icons-material/People'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { Role } from '../enums/role.enum'

// Mock de datos (Aquí conectarías con tu API después)
const stats = [
  {
    label: 'Usuarios Totales',
    value: '1,250',
    icon: <PeopleIcon color='primary' />,
    color: '#e3f2fd',
  },
  {
    label: 'Nuevos Posts',
    value: '85',
    icon: <PostAddIcon color='secondary' />,
    color: '#f3e5f5',
  },
  {
    label: 'Reportes Pendientes',
    value: '12',
    icon: <ShieldIcon color='error' />,
    color: '#ffebee',
  },
]

export const AdminDashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' fontWeight='bold' gutterBottom>
        Panel de Administración
      </Typography>

      {/* 1. SECCIÓN DE ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: stat.color,
                borderRadius: 3,
              }}
            >
              <Avatar sx={{ bgcolor: 'white', width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  {stat.label}
                </Typography>
                <Typography variant='h5' fontWeight='bold'>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 2. TABLA DE USUARIOS RECIENTES */}
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
        Gestión de Usuarios
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align='right'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Aquí harías un .map de tus usuarios reales de la DB */}
            <TableRow hover>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }} />{' '}
                <Typography variant='body2' fontWeight='bold'>
                  Alex Espartal
                </Typography>
              </TableCell>
              <TableCell>alex@ejemplo.com</TableCell>
              <TableCell>
                <Chip
                  label={Role.ADMIN}
                  size='small'
                  color='primary'
                  variant='outlined'
                />
              </TableCell>
              <TableCell>
                <Chip
                  label='Activo'
                  size='small'
                  sx={{ bgcolor: '#c8e6c9', color: '#2e7d32' }}
                />
              </TableCell>
              <TableCell align='right'>
                <Button size='small' variant='text' sx={{ mr: 1 }}>
                  Cambiar Rol
                </Button>
                <IconButton color='error' size='small'>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
