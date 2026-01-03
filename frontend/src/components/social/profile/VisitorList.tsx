import { useEffect, useState } from 'react'
import { List, Typography, Paper, Box, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { User } from 'social-network-app-shared/types/auth.type'
import { profileService } from '@/services/profile.service'
import { VisitorListSkeleton } from '../skeleton/VisitorListSkeleton'
import { EmptyState } from '@/components/EmptyState'
import { VisitorItem } from './VisitorItem'

export const VisitorList = () => {
  const [visitors, setVisitors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true)
        const data = await profileService.getProfileVisits()
        setVisitors(data)
      } catch (error) {
        console.error('Error al cargar las visitas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVisits()
  }, [])

  if (loading) return <VisitorListSkeleton />

  return (
    <Paper variant='outlined' sx={{ borderRadius: 0, overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
        <Typography variant='subtitle2' fontWeight='bold'>
          Visitas recientes
        </Typography>
      </Box>
      <Divider />

      <List sx={{ py: 0 }}>
        {visitors.length === 0 ? (
          <EmptyState message='Aún no tienes visitas en tu perfil.' />
        ) : (
          visitors.map((visitor, index) => (
            <VisitorItem
              key={visitor.id}
              visitor={visitor}
              isLast={index === visitors.length - 1}
              onClick={() => navigate(`/profile/${visitor.username}`)}
            />
          ))
        )}
      </List>
    </Paper>
  )
}
