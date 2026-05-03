import React, { useState } from 'react'
import { Box, Text as Typography, IconButton, Paper } from '@/components/ui'
import {
  Toolbar,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Theme,
  Badge,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Brightness4,
  Brightness7,
  Logout,
  ChevronLeft as ChevronLeftIcon,
  Explore as ExploreIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { useNotifications } from '@/context/NotificationContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppTheme } from '@/theme'
import { tokens } from '@/theme/tokens'
import { useAuth } from '@/hooks'

interface LayoutProps {
  children: React.ReactNode
}

const DRAWER_WIDTH = 260
const COLLAPSED_DRAWER_WIDTH = 70

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const muiTheme = useMuiTheme() as Theme & { tokens: typeof tokens }
  const { isDark, toggleTheme } = useAppTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadCount } = useNotifications()

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/', private: true },
    {
      text: 'Explorar',
      icon: <ExploreIcon />,
      path: '/explore',
      private: false,
    },
    {
      text: 'Notificaciones',
      icon: (
        <Badge badgeContent={unreadCount} color='error'>
          <NotificationsIcon />
        </Badge>
      ),
      path: '/notifications',
      private: true,
    },
    ...(user?.username
      ? [
          {
            text: 'Mi perfil',
            icon: (
              <OptimizedAvatar src={user.avatar} alt={user.name} size='sm' />
            ),
            path: `/profile/${user.username}`,
            private: true,
          },
        ]
      : []),
    { text: 'Acerca de', icon: <InfoIcon />, path: '/about', private: false },
  ]

  const filteredMenuItems = menuItems.filter(
    item => !item.private || isAuthenticated
  )

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
            variant='h5'
            fontWeight='900'
            sx={{
              letterSpacing: '0.15em',
              color: '#88B04B', // The green color from the design
              fontFamily: 'Montserrat, sans-serif',
              ml: 1,
            }}
          >
            AURA
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

      {/* 2. MENÚ PRINCIPAL */}
      <List sx={{ px: 2, flexGrow: 1, mt: 2 }}>
        {filteredMenuItems.map(item => {
          const isActive = location.pathname === item.path
          const isNotifications = item.text === 'Notificaciones'

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
              <Tooltip title={isCollapsed ? item.text : ''} placement='right'>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path)
                    if (isMobile) setMobileOpen(false)
                  }}
                  sx={{
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    borderRadius: '16px',
                    backgroundColor: isActive
                      ? alpha('#E0FF4F', 0.05)
                      : 'transparent',
                    color: isActive ? '#E0FF4F' : 'text.secondary',
                    minHeight: 56,
                    '&:hover': {
                      backgroundColor: alpha('#E0FF4F', 0.08),
                      color: '#E0FF4F',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: isActive ? '#E0FF4F' : 'inherit',
                      position: 'relative',
                    }}
                  >
                    {item.icon}
                    {isNotifications && unreadCount > 0 && !isCollapsed && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: -DRAWER_WIDTH + 80,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#88B04B',
                          boxShadow: '0 0 10px rgba(136, 176, 75, 0.6)',
                        }}
                      />
                    )}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 800 : 500,
                        fontSize: '1.05rem',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        })}
      </List>

      {/* 3. SECCIÓN INFERIOR: AJUSTES Y PERFIL */}
      <List
        sx={{
          px: 2,
          py: 3,
          borderTop: `1px solid ${alpha(muiTheme.palette.divider, 0.05)}`,
        }}
      >
        {/* Toggle de Tema */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: '12px',
              justifyContent: isCollapsed ? 'center' : 'initial',
              minHeight: 48,
              color: 'text.primary',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={isDark ? 'Modo Claro' : 'Modo Oscuro'}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                justifyContent: isCollapsed ? 'center' : 'initial',
                color: '#FF4D4D', // Red color from design
                minHeight: 48,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                <Logout />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary='Cerrar sesión'
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* 1. NAVEGACIÓN IZQUIERDA (Menú fijo desktop / Swipeable móvil) */}
        <Box
          component='nav'
          sx={{
            width: {
              xs: 0,
              sm: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
            },
            flexShrink: 0,
            transition: 'width 0.3s',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 1000,
          }}
        >
          {/* Menú lateral móvil con soporte de gestos (Swipe) */}
          <SwipeableDrawer
            anchor='left'
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            disableBackdropTransition={!isMobile} // Optimización
            disableDiscovery={!isMobile}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRight: '1px solid',
                borderColor: 'divider',
                // bgcolor: 'background.default',
              },
            }}
          >
            {drawerContent}
          </SwipeableDrawer>

          {/* Menú lateral escritorio fijo */}
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              height: '100%',
              '& .MuiDrawer-paper': {
                width: 'inherit',
                transition: 'width 0.3s',
                overflowX: 'hidden',
                borderRight: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'none',
                bgcolor: '#0D1117', // Slightly lighter gray for sidebar as requested
                position: 'relative',
                height: '100%',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* 2. ÁREA DE CONTENIDO */}
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            pb: isMobile ? '56px' : 0, // Espacio para el BottomNav en móvil
          }}
        >
          {/* Header móvil simplificado para mostrar el avatar / abrir menú */}
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(
                  muiTheme.palette.background.paper,
                  muiTheme.tokens.opacity.backdrop
                ),
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
              }}
            >
              <IconButton onClick={() => setMobileOpen(true)} sx={{ p: 0.5 }}>
                <OptimizedAvatar
                  src={user?.avatar}
                  alt={user?.name}
                  size={32}
                />
              </IconButton>
              <Typography variant='h6' sx={{ ml: 2, fontWeight: 800 }}>
                Inicio
              </Typography>
            </Box>
          )}

          <Box sx={{ width: '100%', height: '100%' }}>{children}</Box>

          {/* MENÚ INFERIOR MÓVIL (Bottom Navigation) */}
          {isMobile && (
            <Paper
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
              }}
              elevation={3}
            >
              <BottomNavigation
                showLabels={false}
                value={location.pathname}
                onChange={(_, newValue) => navigate(newValue)}
                sx={{
                  height: 56,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <BottomNavigationAction
                  value='/'
                  icon={
                    <HomeIcon sx={{ fontSize: muiTheme.tokens.iconSize.lg }} />
                  }
                />
                <BottomNavigationAction
                  value='/explore'
                  icon={
                    <ExploreIcon
                      sx={{ fontSize: muiTheme.tokens.iconSize.lg }}
                    />
                  }
                />
                <BottomNavigationAction
                  value='/notifications'
                  icon={
                    <Badge badgeContent={unreadCount} color='error'>
                      <NotificationsIcon
                        sx={{ fontSize: muiTheme.tokens.iconSize.lg }}
                      />
                    </Badge>
                  }
                />
                <BottomNavigationAction
                  value='/search'
                  icon={
                    <SearchIcon
                      sx={{ fontSize: muiTheme.tokens.iconSize.lg }}
                    />
                  }
                />
                <BottomNavigationAction
                  value={user ? `/profile/${user.username}` : '/login'}
                  icon={
                    <OptimizedAvatar
                      src={user?.avatar}
                      alt={user?.name}
                      size={28}
                      sx={{
                        border: location.pathname.includes('/profile')
                          ? '2px solid'
                          : 'none',
                        borderColor: 'primary.main',
                      }}
                    />
                  }
                />
              </BottomNavigation>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  )
}
