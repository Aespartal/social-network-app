import { memo } from 'react'
import { Box } from '@/components/ui'

interface PostThreadLineProps {
  isThreadParent: boolean
  isThreadChild: boolean
}

export const PostThreadLine = memo(
  ({ isThreadParent, isThreadChild }: PostThreadLineProps) => {
    if (!isThreadChild && !isThreadParent) return null

    return (
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: isThreadChild ? -24 : 40,
          bottom: isThreadParent ? -24 : 'calc(100% - 28px)',
          width: '2px',
          bgcolor: 'divider',
          zIndex: 0,
        }}
      />
    )
  }
)
