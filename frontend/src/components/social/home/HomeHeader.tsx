import React from 'react'
import { Tab } from '@mui/material'
import { StickyHeader, HomeTabs } from '../../../pages/Home.styles'

interface HomeHeaderProps {
  activeTab: number
  onTabChange: (_: React.SyntheticEvent, newValue: number) => void
  tabsConfig: readonly { id: number; label: string; type: string }[]
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  activeTab,
  onTabChange,
  tabsConfig,
}) => {
  return (
    <StickyHeader>
      <HomeTabs
        value={activeTab}
        onChange={onTabChange}
        variant='fullWidth'
        indicatorColor='primary'
        textColor='primary'
      >
        {tabsConfig.map(tab => (
          <Tab key={tab.id} label={tab.label} />
        ))}
      </HomeTabs>
    </StickyHeader>
  )
}
