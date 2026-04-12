import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  InputBase,
  IconButton,
  alpha,
  useTheme,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ClickAwayListener,
  Fade,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useRecentSearches } from '@/hooks'

interface SearchBarProps {
  placeholder?: string
  initialValue?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar en SocialNetwork',
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const { recentSearches, deleteSearch, clearAll, refresh } =
    useRecentSearches()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      setIsFocused(false)
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      refresh() // Refresh to get the new search in the list
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(value)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteSearch(id)
  }

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Box sx={{ position: 'relative', width: '100%' }} ref={containerRef}>
        <Paper
          component='form'
          onSubmit={onSubmit}
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: theme.tokens.borderRadius.md,
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.divider, 0.1)
                : '#eff3f4',
            border: '1px solid',
            borderColor: isFocused ? 'primary.main' : 'transparent',
            transition: `all ${theme.tokens.transition.normal}`,
            zIndex: 11,
            position: 'relative',
          }}
        >
          <IconButton
            type='submit'
            sx={{ p: '10px', color: 'text.secondary' }}
            aria-label='search'
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              refresh()
            }}
          />
          {value && (
            <IconButton
              size='small'
              onClick={() => setValue('')}
              sx={{ color: 'primary.main' }}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          )}
        </Paper>

        <Fade in={isFocused}>
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 10,
              maxHeight: '400px',
              overflowY: 'auto',
              borderRadius: theme.tokens.borderRadius.none,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {recentSearches.length > 0 ? (
              <Box>
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1' fontWeight={800}>
                    Recientes
                  </Typography>
                  <Typography
                    variant='caption'
                    color='primary'
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    onClick={clearAll}
                  >
                    Borrar todo
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {recentSearches.map(search => (
                    <ListItem
                      component='div'
                      key={search.id}
                      sx={{
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => {
                        setValue(search.query)
                        handleSearch(search.query)
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HistoryIcon fontSize='small' color='disabled' />
                      </ListItemIcon>
                      <ListItemText
                        primary={search.query}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 600,
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size='small'
                          onClick={e => handleDelete(e, search.id)}
                        >
                          <CloseIcon fontSize='small' />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color='text.secondary' variant='body2'>
                  Prueba a buscar personas, temas o palabras clave
                </Typography>
              </Box>
            )}

            {/* Opcional: Sugerencias o Trending topics aquí */}
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  )
}
