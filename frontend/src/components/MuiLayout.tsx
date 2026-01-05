import React, { useState } from 'react'
import {
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Divider,
  Avatar,
  Tooltip,
  alpha,
  Container,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Brightness4,
  Brightness7,
  Logout,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@/theme/ThemeProvider'
import { useAuth } from '@/hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

const DRAWER_WIDTH = 260
const COLLAPSED_DRAWER_WIDTH = 70

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const muiTheme = useMuiTheme()
  const { isDark, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { text: 'Feed', icon: <HomeIcon />, path: '/', private: true },
    {
      text: 'Mi perfil',
      icon: <Avatar src={user?.avatar || ''} sx={{ width: 24, height: 24 }} />, // Avatar en el icono
      path: `/profile/${user?.username}`,
      private: true,
    },
    { text: 'Acerca de', icon: <InfoIcon />, path: '/about', private: false },
  ]

  const filteredMenuItems = menuItems.filter(
    item => !item.private || isAuthenticated
  )

  const currentDrawerWidth = isMobile
    ? DRAWER_WIDTH
    : isCollapsed
      ? COLLAPSED_DRAWER_WIDTH
      : DRAWER_WIDTH

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 1. CABECERA CON LOGO */}
      <Toolbar
        sx={{ justifyContent: isCollapsed ? 'center' : 'space-between', px: 2 }}
      >
        {!isCollapsed && (
          <Typography
            variant='h6'
            fontWeight='800'
            color='primary'
            sx={{ letterSpacing: 1 }}
          >
            SOCIAL
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ mb: 1 }} />

      {/* 2. MENÚ PRINCIPAL */}
      <List sx={{ px: 1, flexGrow: 1 }}>
        {filteredMenuItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.text : ''} placement='right'>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path)
                    if (isMobile) setMobileOpen(false)
                  }}
                  sx={{
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    borderRadius: 2,
                    backgroundColor: isActive
                      ? alpha(muiTheme.palette.primary.main, 0.1)
                      : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    minHeight: 48,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        })}
      </List>

      <Divider />

      {/* 3. SECCIÓN INFERIOR: AJUSTES Y PERFIL */}
      <List sx={{ px: 1, py: 2 }}>
        {/* Toggle de Tema */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 2,
              justifyContent: isCollapsed ? 'center' : 'initial',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
              }}
            >
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText primary={isDark ? 'Modo Claro' : 'Modo Oscuro'} />
            )}
          </ListItemButton>
        </ListItem>

        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'initial',
                color: 'error.main',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: 'error.main',
                }}
              >
                <Logout />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary='Cerrar sesión' />}
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'initial',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                }}
              >
                <Logout sx={{ transform: 'rotate(180deg)' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary='Iniciar Sesión' />}
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  )

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Botón flotante para móvil (reemplaza al AppBar ausente) */}
        {isMobile && !mobileOpen && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              position: 'fixed',
              top: 10,
              left: 10,
              zIndex: 1100,
              bgcolor: 'background.paper',
              boxShadow: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          component='nav'
          sx={{
            width: { sm: currentDrawerWidth },
            flexShrink: { sm: 0 },
            transition: 'width 0.3s',
          }}
        >
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                width: currentDrawerWidth,
                transition: 'width 0.3s',
                overflowX: 'hidden',
                borderRight: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        <Box
          component='main'
          sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: '100%' }}
        >
          {/* Espaciador para móvil si el contenido choca con el botón flotante */}
          {isMobile && <Box sx={{ height: 50 }} />}
          {children}
        </Box>
      </Box>
    </Container>
  )
}
