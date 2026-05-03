import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Typography,
  List,
  ClickAwayListener,
  Fade,
  useTheme,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useRecentSearches } from '@/hooks'

// Piezas Atómicas
import { RecentSearchItem } from './parts/RecentSearchItem'

// Estilos
import { getSearchBarStyles } from './SearchBar.styles'

interface SearchBarProps {
  placeholder?: string
  initialValue?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar en Aura',
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const { recentSearches, deleteSearch, clearAll, refresh } =
    useRecentSearches()

  const styles = getSearchBarStyles(theme, isFocused)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      setIsFocused(false)
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      refresh()
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
      <Box sx={styles.container} ref={containerRef}>
        <Paper
          component='form'
          onSubmit={onSubmit}
          elevation={0}
          sx={styles.searchPaper}
        >
          <IconButton
            type='submit'
            sx={{ p: '10px', color: 'text.secondary' }}
            aria-label='search'
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={styles.input}
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
          <Paper elevation={4} sx={styles.dropdownPaper}>
            {recentSearches.length > 0 ? (
              <Box>
                <Box sx={styles.dropdownHeader}>
                  <Typography variant='subtitle1' sx={styles.dropdownTitle}>
                    Recientes
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={styles.clearAll}
                    onClick={clearAll}
                  >
                    Borrar todo
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {recentSearches.map(search => (
                    <RecentSearchItem
                      key={search.id}
                      id={search.id}
                      query={search.query}
                      onClick={query => {
                        setValue(query)
                        handleSearch(query)
                      }}
                      onDelete={handleDelete}
                      styles={styles}
                    />
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
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  )
}
