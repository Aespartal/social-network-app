import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
