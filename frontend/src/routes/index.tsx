import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { Role } from '@/enums/role.enum'

// Eager loading para páginas principales
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

// Lazy loading para páginas secundarias
const About = lazy(() =>
  import('@/pages/About').then(m => ({ default: m.About }))
)
const Profile = lazy(() =>
  import('@/pages/Profile').then(m => ({ default: m.Profile }))
)
const PostDetail = lazy(() =>
  import('@/pages/PostDetail').then(m => ({ default: m.PostDetail }))
)
const AdminDashboard = lazy(() =>
  import('@/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
)
const Search = lazy(() =>
  import('@/pages/Search').then(m => ({ default: m.Search }))
)
const Explore = lazy(() =>
  import('@/pages/Explore').then(m => ({ default: m.Explore }))
)
const Notifications = lazy(() =>
  import('@/pages/social/NotificationsPage').then(m => ({
    default: m.NotificationsPage,
  }))
)

// Guards
import { RoleGuard } from '@/guards/RoleGuard'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/profile/:username',
    element: <Profile />,
  },
  {
    path: '/post/:id',
    element: <PostDetail />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/explore',
    element: <Explore />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    element: <RoleGuard allowedRoles={[Role.ADMIN]} />,
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
      },
    ],
  },
]
