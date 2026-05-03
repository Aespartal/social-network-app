import { useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Alert,
  Tooltip,
  Modal,
  Fade,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useAchievements } from '@/hooks/useAchievements'
import { ACHIEVEMENT_CATEGORIES, getTierColor } from '@/constants/achievements'
import { UserAchievement } from '@/services/post.service'

// Estilos Zen
import {
  AchievementsContainer,
  AuraEvolutionCard,
  SlimProgress,
  AchievementCircle,
  CategoryLabel,
  ZenModal,
} from './ProfileAchievements.styles'

interface AchievementDTO {
  id: string
  achievementName: string
  description: string | null
  iconEmoji: string | null
  tierAchieved: string | null
  progress: number
  completedAt: string | null
  xpEarned: number
  category: string
}

/**
 * MODAL: Revelación de Esencia
 */
const AchievementModal = ({
  achievement,
  onClose,
}: {
  achievement: AchievementDTO | null
  onClose: () => void
}) => {
  const theme = useTheme()
  if (!achievement) return null
  const isCompleted = achievement.completedAt !== null
  const tierColor = getTierColor(achievement.tierAchieved)

  return (
    <Modal open={!!achievement} onClose={onClose} closeAfterTransition>
      <Fade in={!!achievement}>
        <ZenModal>
          <IconButton
            size='small'
            onClick={onClose}
            sx={{ position: 'absolute', top: 16, right: 16, opacity: 0.5 }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>

          <Stack alignItems='center' spacing={3}>
            <AchievementCircle
              completed={isCompleted}
              color={tierColor}
              sx={{ width: 80, height: 80, fontSize: '2.5rem' }}
            >
              {achievement.iconEmoji || '✨'}
            </AchievementCircle>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Montserrat, sans-serif',
                  mb: 1,
                }}
              >
                {achievement.achievementName}
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  fontFamily: 'Lora, serif',
                  fontStyle: 'italic',
                  opacity: 0.8,
                }}
              >
                {achievement.description}
              </Typography>
            </Box>

            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette.divider, 0.05),
              }}
            >
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='caption' color='text.secondary'>
                  {isCompleted ? 'Desbloqueado' : 'Camino por recorrer'}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  +{achievement.xpEarned} XP
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </ZenModal>
      </Fade>
    </Modal>
  )
}

/**
 * COMPONENTE PRINCIPAL
 */
export const ProfileAchievements = ({
  userId,
  showTitle = true,
}: {
  userId?: string
  showTitle?: boolean
}) => {
  const {
    loading,
    error,
    getAchievementsByCategory,
    totalXP,
    level,
    progressToNextLevel,
  } = useAchievements(userId)

  const [selected, setSelected] = useState<AchievementDTO | null>(null)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} variant='circular' width={56} height={56} />
        ))}
      </Box>
    )
  }

  if (error)
    return (
      <Alert severity='error' sx={{ borderRadius: '16px' }}>
        {error}
      </Alert>
    )

  return (
    <AchievementsContainer>
      {showTitle && (
        <AuraEvolutionCard>
          <Stack spacing={3}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Box>
                <Typography
                  variant='h2'
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {level}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.6,
                  }}
                >
                  Nivel de Esencia
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant='h6'
                  sx={{ color: 'primary.main', fontWeight: 700 }}
                >
                  {totalXP} XP
                </Typography>
                <Typography
                  variant='caption'
                  color='primary.main'
                  sx={{ fontWeight: 800 }}
                >
                  {totalXP} Resonancia Total
                </Typography>
              </Box>
            </Stack>

            <Box>
              <SlimProgress>
                <Box sx={{ width: `${progressToNextLevel}%` }} />
              </SlimProgress>
              <Typography
                variant='caption'
                sx={{
                  mt: 1,
                  display: 'block',
                  opacity: 0.5,
                  fontStyle: 'italic',
                }}
              >
                Tu aura se está expandiendo... {Math.round(progressToNextLevel)}
                % para la siguiente fase.
              </Typography>
            </Box>
          </Stack>
        </AuraEvolutionCard>
      )}

      {ACHIEVEMENT_CATEGORIES.map(cat => {
        const catAchievements = getAchievementsByCategory(cat.id)
        if (catAchievements.length === 0) return null
        return (
          <Box key={cat.id}>
            <CategoryLabel>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: cat.color,
                }}
              />
              <Typography component='span'>{cat.label}</Typography>
            </CategoryLabel>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {catAchievements.map((a: UserAchievement) => (
                <Tooltip key={a.id} title={a.achievementName} arrow>
                  <AchievementCircle
                    completed={a.completedAt !== null}
                    color={getTierColor(a.tierAchieved)}
                    onClick={() => setSelected(a)}
                  >
                    {a.iconEmoji || '✨'}
                  </AchievementCircle>
                </Tooltip>
              ))}
            </Box>
          </Box>
        )
      })}

      <AchievementModal
        achievement={selected}
        onClose={() => setSelected(null)}
      />
    </AchievementsContainer>
  )
}
