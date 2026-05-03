import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Role } from '@/enums/role.enum'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const { user } = context

  const isAdmin = user?.role === Role.ADMIN
  const isModerator = user?.role === Role.MODERATOR
  const isStaff = isAdmin || isModerator
  const isUser = user?.role === Role.USER

  return {
    ...context,
    isAdmin,
    isModerator,
    isStaff,
    isUser,
  }
}
