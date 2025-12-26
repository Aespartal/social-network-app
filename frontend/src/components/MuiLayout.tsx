import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, ListItemButton, Box, useMediaQuery,
  useTheme as useMuiTheme, Divider, Avatar, Menu, MenuItem, Button,
  Stack, Tooltip, alpha
} from '@mui/material';
import {
  Menu as MenuIcon, Home as HomeIcon, Info as InfoIcon,
  Brightness4, Brightness7, Logout, ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 70;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Para escritorio
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Feed', icon: <HomeIcon />, path: '/', private: true },
    { text: 'Acerca de', icon: <InfoIcon />, path: '/about', private: false },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.private || isAuthenticated);

  const currentDrawerWidth = isMobile ? DRAWER_WIDTH : (isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
        {!isCollapsed && (
          <Typography variant="h6" fontWeight="800" color="primary">
            SOCIAL
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Toolbar>
      
      <Divider />

      {isAuthenticated && !isCollapsed && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.avatar || ''}>{user?.name?.charAt(0)}</Avatar>
          <Box overflow="hidden">
            <Typography variant="subtitle2" noWrap>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>@{user?.username}</Typography>
          </Box>
        </Box>
      )}

      <List sx={{ px: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.text : ""} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    borderRadius: 2,
                    backgroundColor: isActive ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    '&:hover': { backgroundColor: alpha(muiTheme.palette.primary.main, 0.05) }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center',
                    color: isActive ? 'primary.main' : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
         {!isCollapsed && <Typography variant="caption" color="text.disabled">v1.0.0 © 2025</Typography>}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: muiTheme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(muiTheme.palette.background.paper, 0.8),
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={toggleTheme} color="inherit">
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar src={user?.avatar || ''} sx={{ width: 35, height: 35 }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => navigate('/login')}>Login</Button>
                <Button size="small" variant="contained" onClick={() => navigate('/register')}>Unirse</Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: currentDrawerWidth, transition: 'width 0.3s', overflowX: 'hidden' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${currentDrawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};