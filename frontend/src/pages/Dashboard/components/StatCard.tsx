import React from 'react'
import { Paper, Box, Typography, Icon } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  trend: number
  isUp: boolean
  icon: string
  color: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  isUp,
  icon,
  color,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: theme => theme.shadows[4],
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon>{icon}</Icon>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: isUp ? 'success.main' : 'error.main',
              bgcolor: isUp ? 'success.light' : 'error.light',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              opacity: 0.8,
            }}
          >
            {isUp ? (
              <TrendingUp fontSize='small' />
            ) : (
              <TrendingDown fontSize='small' />
            )}
            <Typography variant='caption' sx={{ fontWeight: 'bold', ml: 0.5 }}>
              {trend}%
            </Typography>
          </Box>
        </Box>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ fontWeight: 500, mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant='h4'
          sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
        >
          {value}
        </Typography>
      </Paper>
    </motion.div>
  )
}
