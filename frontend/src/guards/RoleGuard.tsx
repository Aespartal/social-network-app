import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '../enums/role.enum'

interface RoleGuardProps {
  allowedRoles: Role[]
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
