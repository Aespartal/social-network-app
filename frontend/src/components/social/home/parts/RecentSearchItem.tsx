import React from 'react'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import { History as HistoryIcon, Close as CloseIcon } from '@mui/icons-material'
import type { getSearchBarStyles } from '../SearchBar.styles'

type SearchBarStyles = ReturnType<typeof getSearchBarStyles>

interface RecentSearchItemProps {
  query: string
  id: string
  onClick: (query: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  styles: SearchBarStyles
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({
  query,
  id,
  onClick,
  onDelete,
  styles,
}) => {
  return (
    <ListItem
      component='div'
      sx={styles.recentItem}
      onClick={() => onClick(query)}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <HistoryIcon fontSize='small' color='disabled' />
      </ListItemIcon>
      <ListItemText
        primary={query}
        primaryTypographyProps={{
          variant: 'body2',
          fontWeight: 600,
        }}
      />
      <ListItemSecondaryAction>
        <IconButton size='small' onClick={e => onDelete(e, id)}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
