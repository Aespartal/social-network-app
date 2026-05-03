import React from 'react'
import { Box } from '@mui/material'
import {
  StickyHeader,
  FeedSelectorContainer,
  FeedSelectorItem,
  AuraDot,
} from '../../../pages/Home.styles'
import { SearchBar } from './SearchBar'

interface HomeHeaderProps {
  activeTab: number
  onTabChange: (newValue: number) => void
  tabsConfig: readonly { id: number; label: string; type: string }[]
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  activeTab,
  onTabChange,
  tabsConfig,
}) => {
  return (
    <StickyHeader>
      {/* 2. Centro: Selector de Feed */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flex: 2,
        }}
      >
        <FeedSelectorContainer>
          {tabsConfig.map((tab, index) => {
            const isActive = activeTab === index
            return (
              <FeedSelectorItem
                key={tab.id}
                active={isActive}
                onClick={() => onTabChange(index)}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <AuraDot
                    layoutId='activeTab'
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </FeedSelectorItem>
            )
          })}
        </FeedSelectorContainer>
      </Box>

      {/* 3. Derecha: SearchBar */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '180px' }}>
          <SearchBar placeholder='Buscar...' />
        </Box>
      </Box>
    </StickyHeader>
  )
}
