import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@/enums/role.enum'
import { Loading, Box } from '@/components/ui'

interface RoleGuardProps {
  allowedRoles: Role[]
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Loading text='Verificando permisos...' />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (!allowedRoles.includes(user.role as Role)) {
    return <Navigate to='/forbidden' replace />
  }

  return <Outlet />
}
