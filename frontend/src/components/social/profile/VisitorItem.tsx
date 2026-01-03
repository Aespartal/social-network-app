import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material'
import { User } from 'social-network-app-shared/types/auth.type'

export interface VisitorItemProps {
  visitor: User
  isLast: boolean
  onClick: () => void
}

export const VisitorItem = ({ visitor, isLast, onClick }: VisitorItemProps) => {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0 }}>
            <Avatar
              src={visitor.avatar || ''}
              alt={visitor.name}
              sx={{ width: 40, height: 40 }}
            />
          </ListItemAvatar>

          <ListItemText
            sx={{ minWidth: 0, m: 0 }}
            primary={
              <Typography variant='body2' fontWeight='bold' noWrap>
                {visitor.name}
              </Typography>
            }
            secondary={
              <Typography
                variant='caption'
                color='text.secondary'
                noWrap
                display='block'
              >
                @{visitor.username}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
      {!isLast && <Divider variant='inset' component='li' />}
    </>
  )
}
