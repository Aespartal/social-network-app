import React, { useEffect, useState, useRef } from 'react'
import { Text as Typography, Button, Box } from '@/components/ui'
import { useTheme } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { profileService } from '@/services'
import { User } from 'social-network-app-shared/types/auth.type'
import { SuggestedUsersSkeleton } from '../skeleton/SuggestedUsersSkeleton'
import { Link } from 'react-router-dom'

// Piezas Atómicas
import { SuggestedUserItem } from './parts/SuggestedUserItem'

// Hooks
import { useAuth } from '@/hooks'

// Estilos
import { getSuggestedUsersStyles } from './SuggestedUsers.styles'

export const SuggestedUsers: React.FC = () => {
  const theme = useTheme()
  const { isAuthenticated } = useAuth()
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState<string[]>([])
  const hasFetchedRef = useRef(false)

  const styles = getSuggestedUsersStyles(theme)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (hasFetchedRef.current) return
      hasFetchedRef.current = true

      try {
        const response = await profileService.getSuggestions(5)
        setSuggestions(response || [])
      } catch (err) {
        console.error('Error cargando sugerencias:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const handleFollow = async (userId: string) => {
    setFollowingIds(prev => [...prev, userId])
    try {
      console.log('Conectando con:', userId)
    } catch (err: unknown) {
      console.error('Error al conectar:', err)
      setFollowingIds(prev => prev.filter(id => id !== userId))
    }
  }

  if (loading) return <SuggestedUsersSkeleton />
  if (suggestions.length === 0) return null

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant='subtitle1' sx={styles.title}>
          Conexiones por Afinidad
        </Typography>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'success.main',
            boxShadow: '0 0 10px rgba(0, 186, 124, 0.5)',
          }}
        />
      </Box>

      <Box sx={styles.list}>
        <AnimatePresence>
          {suggestions.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SuggestedUserItem
                user={user}
                isFollowing={followingIds.includes(user.id)}
                onFollow={handleFollow}
                styles={styles}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      <Box sx={styles.footer}>
        <Button
          variant='ghost'
          fullWidth
          size='small'
          component={Link}
          to='/explore/people'
          sx={styles.moreButton}
        >
          Ver más mentes afines
        </Button>
      </Box>
    </Box>
  )
}
