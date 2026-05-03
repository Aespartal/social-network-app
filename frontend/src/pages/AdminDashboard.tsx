import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Text as Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Stack,
  Loading,
} from '@/components/ui'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  alpha,
  useTheme,
  Pagination,
} from '@mui/material'
import ShieldIcon from '@mui/icons-material/Shield'
import PeopleIcon from '@mui/icons-material/People'
import PostAddIcon from '@mui/icons-material/PostAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

import { adminService, AdminStats } from '@/services/admin.service'
import { User } from 'social-network-app-shared/types/auth.type'
import { Role } from '@/enums/role.enum'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const AdminDashboard = () => {
  const theme = useTheme()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsData, usersResponse] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(page),
      ])
      setStats(statsData)
      setUsers(usersResponse.data)
      setTotalPages(
        (usersResponse.meta as unknown as { totalPages: number }).totalPages
      )
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleToggleActive = async (userId: string) => {
    try {
      const result = await adminService.toggleUserActive(userId)
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, active: result.active } : u))
      )
    } catch (err) {
      console.error('Error toggling user status:', err)
    }
  }

  const handleRoleChange = async (role: Role) => {
    if (!selectedUser) return
    try {
      await adminService.updateUserRole(selectedUser.id, role)
      setUsers(prev =>
        prev.map(u => (u.id === selectedUser.id ? { ...u, role } : u))
      )
      setAnchorEl(null)
    } catch (err) {
      console.error('Error changing user role:', err)
    }
  }

  const chartData =
    stats?.dailyGrowth.map(d => ({
      name: format(new Date(d.createdAt), 'dd MMM', { locale: es }),
      users: d._count,
    })) || []

  if (loading && !stats) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Loading text='Sincronizando el Panel de Control...' />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant='h4'
            fontWeight='800'
            sx={{ letterSpacing: '-0.02em' }}
          >
            Aura Admin Central
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Gestión y analíticas de la red social
          </Typography>
        </Box>
        <Button
          variant='outline'
          startIcon={<TrendingUpIcon />}
          onClick={fetchData}
        >
          Refrescar Datos
        </Button>
      </Stack>

      {/* 1. SECCIÓN DE ESTADÍSTICAS RÁPIDAS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: 'Usuarios Totales',
            value: stats?.totalUsers || 0,
            icon: <PeopleIcon />,
            color: theme.palette.primary.main,
          },
          {
            label: 'Posts Activos',
            value: stats?.totalPosts || 0,
            icon: <PostAddIcon />,
            color: '#10b981',
          },
          {
            label: 'Usuarios Online',
            value: stats?.activeUsers || 0,
            icon: <TrendingUpIcon />,
            color: '#6366f1',
          },
          {
            label: 'Reportes',
            value: stats?.reportsPending || 0,
            icon: <ShieldIcon />,
            color: theme.palette.error.main,
          },
        ].map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: '24px',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 20px 40px ${alpha(stat.color, 0.1)}`,
                  borderColor: alpha(stat.color, 0.3),
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color,
                  width: 56,
                  height: 56,
                }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontWeight: 600 }}
                >
                  {stat.label}
                </Typography>
                <Typography variant='h5' fontWeight='800'>
                  {stat.value.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 2. ANALÍTICAS DE CRECIMIENTO */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '32px', minHeight: '400px' }}>
            <Typography variant='h6' fontWeight='700' sx={{ mb: 3 }}>
              Crecimiento de Usuarios (7d)
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset='95%'
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke={alpha(theme.palette.divider, 0.1)}
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: theme.shadows[4],
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='users'
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill='url(#colorUsers)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '32px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant='h6' fontWeight='700' sx={{ mb: 3 }}>
              Acciones Rápidas
            </Typography>
            <Stack spacing={2}>
              <Button
                variant='outline'
                sx={{ justifyContent: 'flex-start', py: 2 }}
              >
                Exportar Datos CSV
              </Button>
              <Button
                variant='outline'
                sx={{ justifyContent: 'flex-start', py: 2 }}
              >
                Ver Logs del Sistema
              </Button>
              <Button
                variant='outline'
                sx={{ justifyContent: 'flex-start', py: 2 }}
              >
                Configuración Global
              </Button>
              <Button
                variant='outline'
                color='error'
                sx={{ justifyContent: 'flex-start', py: 2 }}
              >
                Mantenimiento
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. GESTIÓN DE USUARIOS */}
      <Paper
        sx={{
          borderRadius: '32px',
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' fontWeight='700'>
            Directorio de Usuarios
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color='primary'
            size='small'
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nivel/XP</TableCell>
                <TableCell align='right' sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction='row' spacing={1.5} alignItems='center'>
                      <Avatar
                        src={user.avatar || ''}
                        sx={{ width: 40, height: 40, fontWeight: 700 }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' fontWeight='700'>
                          {user.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          @{user.username}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size='small'
                      variant='outlined'
                      sx={{
                        fontWeight: 700,
                        borderColor:
                          user.role === Role.ADMIN
                            ? theme.palette.primary.main
                            : 'divider',
                        color:
                          user.role === Role.ADMIN
                            ? theme.palette.primary.main
                            : 'text.primary',
                        bgcolor:
                          user.role === Role.ADMIN
                            ? alpha(theme.palette.primary.main, 0.05)
                            : 'transparent',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.active ? 'Activo' : 'Deactivado'}
                      size='small'
                      sx={{
                        fontWeight: 600,
                        bgcolor: user.active
                          ? alpha('#10b981', 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        color: user.active
                          ? '#059669'
                          : theme.palette.error.main,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' fontWeight='600'>
                      Lvl {user.currentLevel}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {user.totalXP} XP
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton
                      size='small'
                      onClick={e => {
                        setAnchorEl(e.currentTarget)
                        setSelectedUser(user)
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menú de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            mt: 1,
            boxShadow: theme.shadows[8],
            minWidth: 180,
          },
        }}
      >
        <Typography
          variant='caption'
          sx={{ px: 2, py: 1, display: 'block', opacity: 0.5, fontWeight: 700 }}
        >
          CAMBIAR ROL
        </Typography>
        <MenuItem onClick={() => handleRoleChange(Role.USER)}>
          Usuario Standard
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(Role.MODERATOR)}>
          Moderador
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(Role.ADMIN)}>
          Administrador
        </MenuItem>
        <Box
          sx={{
            my: 1,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        />
        <MenuItem
          onClick={() => {
            if (selectedUser) handleToggleActive(selectedUser.id)
            setAnchorEl(null)
          }}
          sx={{ color: selectedUser?.active ? 'error.main' : 'success.main' }}
        >
          {selectedUser?.active ? 'Desactivar Cuenta' : 'Activar Cuenta'}
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AdminDashboard
