import React from 'react'
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  CardHeader as MuiCardHeader,
  Typography,
} from '@mui/material'

export interface CardProps extends React.ComponentProps<typeof MuiCard> {
  children: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardContentProps
  extends React.ComponentProps<typeof MuiCardContent> {
  children: React.ReactNode
}

export interface CardFooterProps
  extends React.ComponentProps<typeof MuiCardActions> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <MuiCard {...props}>{children}</MuiCard>
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  ...props
}) => {
  return (
    <MuiCardHeader
      title={
        typeof children === 'string' ? (
          <Typography variant='h6' component='h2'>
            {children}
          </Typography>
        ) : (
          children
        )
      }
      {...props}
    />
  )
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  ...props
}) => {
  return <MuiCardContent {...props}>{children}</MuiCardContent>
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  ...props
}) => {
  return <MuiCardActions {...props}>{children}</MuiCardActions>
}
