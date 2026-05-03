import React from 'react'
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  styled,
} from '@mui/material'

export interface AvatarProps extends MuiAvatarProps {
  size?: number | string
}

const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: prop => prop !== 'size',
})<{ size?: number | string }>(({ size }) => ({
  width: size || 40,
  height: size || 40,
}))

/**
 * Componente Avatar desacoplado.
 * Permite definir el tamaño de forma más semántica.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ size, children, ...props }, ref) => {
    return (
      <StyledAvatar ref={ref} size={size} {...props}>
        {children}
      </StyledAvatar>
    )
  }
)

Avatar.displayName = 'Avatar'
