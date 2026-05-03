import { Box } from '@mui/material'
import { getLevelColor } from '@/constants/levels'

interface ExperienceRingProps {
  level: number
  progress: number
  size: number
  children: React.ReactNode
}

export const ExperienceRing = ({
  level,
  progress,
  size,
  children,
}: ExperienceRingProps) => {
  const color = getLevelColor(level)
  const strokeWidth = 3
  const radius = size / 2 - strokeWidth - 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          filter: `drop-shadow(0 0 2px ${color}66)`,
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke='rgba(255,255,255,0.05)'
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: strokeWidth + 2,
          left: strokeWidth + 2,
          right: strokeWidth + 2,
          bottom: strokeWidth + 2,
          borderRadius: '50%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
