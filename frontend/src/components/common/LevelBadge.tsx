import { Box, Typography } from '@mui/material'
import { getLevelColor } from '@/constants/levels'

interface LevelBadgeProps {
  level: number
  size?: 'small' | 'medium' | 'large'
}

export const LevelBadge = ({ level, size = 'medium' }: LevelBadgeProps) => {
  const sizes = {
    small: 20,
    medium: 28,
    large: 34,
  }

  const fontSizes = {
    small: 10,
    medium: 12,
    large: 15,
  }

  const badgeSize = sizes[size]
  const fontSize = fontSizes[size]
  const color = getLevelColor(level)

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: badgeSize,
        height: badgeSize,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid',
        borderColor: '#121212',
        boxShadow: `0 4px 12px ${color}44`,
        zIndex: 10,
      }}
    >
      <Typography
        sx={{
          fontSize,
          fontWeight: 900,
          color: 'white',
          lineHeight: 1,
          fontFamily: '"Outfit", sans-serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {level}
      </Typography>
    </Box>
  )
}
