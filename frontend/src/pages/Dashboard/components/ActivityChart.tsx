import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Box, Typography, useTheme, Paper } from '@mui/material'
import { ActivityData } from '../mockData'

interface ActivityChartProps {
  data: ActivityData[]
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        height: 400,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          Actividad del Sistema
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Análisis de posts e interacciones en los últimos 7 días
        </Typography>
      </Box>

      <ResponsiveContainer width='100%' height='80%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorPosts' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={theme.palette.primary.main}
                stopOpacity={0.3}
              />
              <stop
                offset='95%'
                stopColor={theme.palette.primary.main}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id='colorInter' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={theme.palette.secondary.main}
                stopOpacity={0.3}
              />
              <stop
                offset='95%'
                stopColor={theme.palette.secondary.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            vertical={false}
            stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
          />
          <XAxis
            dataKey='name'
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
            }}
          />
          <Area
            type='monotone'
            dataKey='posts'
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            fillOpacity={1}
            fill='url(#colorPosts)'
          />
          <Area
            type='monotone'
            dataKey='interactions'
            stroke={theme.palette.secondary.main}
            strokeWidth={3}
            fillOpacity={1}
            fill='url(#colorInter)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  )
}
