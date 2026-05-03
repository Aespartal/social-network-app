import { PrismaClient } from '../../../generated/prisma/client'
import {
  AchievementCategory,
  AchievementTierType,
} from '../domain/entities/achievement.entity'

const prisma = new PrismaClient()

const achievements = [
  // === ONBOARDING ===
  {
    name: 'Primera Impresión',
    description: 'Sube una foto de perfil para completar tu identidad',
    slug: 'first_avatar',
    category: AchievementCategory.ONBOARDING,
    triggerEvent: 'user.profile.avatar_updated',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '👤',
    xpReward: 50,
    announced: true,
  },
  {
    name: 'Dime Más',
    description: 'Añade una biografía a tu perfil',
    slug: 'bio_complete',
    category: AchievementCategory.ONBOARDING,
    triggerEvent: 'user.profile.bio_updated',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '📝',
    xpReward: 30,
    announced: true,
  },
  {
    name: 'Hola Mundo',
    description: 'Crea tu primer post',
    slug: 'first_post',
    category: AchievementCategory.ONBOARDING,
    triggerEvent: 'post.created',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '👋',
    xpReward: 25,
    announced: true,
  },
  {
    name: 'Conectado',
    description: 'Sigue a otros usuarios',
    slug: 'first_follow',
    category: AchievementCategory.ONBOARDING,
    triggerEvent: 'user.followed',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🤝',
    xpReward: 30,
    announced: true,
  },
  {
    name: 'Primera Voz',
    description: 'Deja tu primer comentario',
    slug: 'first_comment',
    category: AchievementCategory.ONBOARDING,
    triggerEvent: 'comment.created',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '💬',
    xpReward: 25,
    announced: true,
  },

  // === ENGAGEMENT ===
  {
    name: 'Dedo Encendido',
    description: 'Dale me gusta a otros usuarios',
    slug: 'liker',
    category: AchievementCategory.ENGAGEMENT,
    triggerEvent: 'post.liked',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '👍',
    xpReward: 5,
    announced: true,
  },
  {
    name: 'Conversador',
    description: 'Únete a conversaciones',
    slug: 'commenter',
    category: AchievementCategory.ENGAGEMENT,
    triggerEvent: 'comment.created',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '💬',
    xpReward: 10,
    announced: true,
  },
  {
    name: 'Amplificador',
    description: 'Comparte contenido con otros',
    slug: 'sharer',
    category: AchievementCategory.ENGAGEMENT,
    triggerEvent: 'post.shared',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🔁',
    xpReward: 15,
    announced: true,
  },
  {
    name: 'Influencer',
    description: 'Gana seguidores',
    slug: 'follower_gained',
    category: AchievementCategory.ENGAGEMENT,
    triggerEvent: 'user.followed',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '👥',
    xpReward: 20,
    announced: true,
  },
  {
    name: 'Encendido',
    description: 'Recibe likes en tus comentarios',
    slug: 'comment_liked',
    category: AchievementCategory.ENGAGEMENT,
    triggerEvent: 'comment.liked',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🔥',
    xpReward: 15,
    announced: true,
  },

  // === CONTENT ===
  {
    name: 'Voz Diaria',
    description: 'Publica varios días seguidos',
    slug: 'daily_voice',
    category: AchievementCategory.CONTENT,
    triggerEvent: 'post.created',
    tierType: AchievementTierType.STREAK,
    iconEmoji: '📝',
    xpReward: 25,
    announced: true,
  },
  {
    name: 'Multimedia',
    description: 'Comparte imágenes y videos',
    slug: 'multimedia_poster',
    category: AchievementCategory.CONTENT,
    triggerEvent: 'post.created_with_media',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '📸',
    xpReward: 10,
    announced: true,
  },
  {
    name: 'Viral',
    description: 'Llega a más personas con tus posts',
    slug: 'viral_post',
    category: AchievementCategory.CONTENT,
    triggerEvent: 'post.likes_received',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🚀',
    xpReward: 100,
    announced: true,
  },
  {
    name: 'Etiquetado',
    description: 'Usa hashtags en tus posts',
    slug: 'hashtag_user',
    category: AchievementCategory.CONTENT,
    triggerEvent: 'post.created_with_tags',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🏷️',
    xpReward: 5,
    announced: true,
  },
  {
    name: 'Guardado',
    description: 'Otros guardan tus posts',
    slug: 'bookmarked_post',
    category: AchievementCategory.CONTENT,
    triggerEvent: 'post.bookmarked',
    tierType: AchievementTierType.MILESTONE,
    iconEmoji: '🔖',
    xpReward: 30,
    announced: true,
  },

  // === EXPLORATION ===
  {
    name: 'Ojo Curioso',
    description: 'Explora todas las secciones de tu perfil',
    slug: 'curious_cat',
    category: AchievementCategory.EXPLORATION,
    triggerEvent: 'user.profile.sections_viewed',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '🕵️',
    xpReward: 100,
    isHidden: true,
    announced: false,
  },
  {
    name: 'Estético',
    description: 'Personaliza tu perfil',
    slug: 'aesthetic_user',
    category: AchievementCategory.EXPLORATION,
    triggerEvent: 'user.profile.theme_changed',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '🎨',
    xpReward: 75,
    isHidden: true,
    announced: false,
  },
  {
    name: 'Data Lover',
    description: 'Mira tus estadísticas',
    slug: 'stats_viewer',
    category: AchievementCategory.EXPLORATION,
    triggerEvent: 'user.stats_viewed',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '📊',
    xpReward: 50,
    isHidden: true,
    announced: false,
  },
  {
    name: 'Noctámbulo',
    description: 'Publica entre medianoche y las 5am',
    slug: 'night_owl',
    category: AchievementCategory.EXPLORATION,
    triggerEvent: 'post.created_night',
    tierType: AchievementTierType.BINARY,
    iconEmoji: '🌙',
    xpReward: 75,
    isHidden: true,
    announced: false,
  },
]

const tiers = [
  // Liker milestones
  { achievementSlug: 'liker', tier: 'bronze', threshold: 10, xpReward: 50 },
  { achievementSlug: 'liker', tier: 'silver', threshold: 50, xpReward: 100 },
  { achievementSlug: 'liker', tier: 'gold', threshold: 100, xpReward: 250 },
  { achievementSlug: 'liker', tier: 'diamond', threshold: 500, xpReward: 500 },

  // Commenter milestones
  {
    achievementSlug: 'commenter',
    tier: 'bronze',
    threshold: 10,
    xpReward: 100,
  },
  {
    achievementSlug: 'commenter',
    tier: 'silver',
    threshold: 50,
    xpReward: 200,
  },
  { achievementSlug: 'commenter', tier: 'gold', threshold: 100, xpReward: 400 },
  {
    achievementSlug: 'commenter',
    tier: 'diamond',
    threshold: 500,
    xpReward: 1000,
  },

  // Follower gained milestones
  {
    achievementSlug: 'follower_gained',
    tier: 'bronze',
    threshold: 10,
    xpReward: 200,
  },
  {
    achievementSlug: 'follower_gained',
    tier: 'silver',
    threshold: 50,
    xpReward: 400,
  },
  {
    achievementSlug: 'follower_gained',
    tier: 'gold',
    threshold: 100,
    xpReward: 800,
  },
  {
    achievementSlug: 'follower_gained',
    tier: 'diamond',
    threshold: 500,
    xpReward: 2000,
  },

  // First post milestones
  { achievementSlug: 'first_post', tier: 'bronze', threshold: 1, xpReward: 25 },
  {
    achievementSlug: 'first_post',
    tier: 'silver',
    threshold: 10,
    xpReward: 100,
  },
  { achievementSlug: 'first_post', tier: 'gold', threshold: 50, xpReward: 300 },
  {
    achievementSlug: 'first_post',
    tier: 'platinum',
    threshold: 100,
    xpReward: 500,
  },

  // First follow milestones
  {
    achievementSlug: 'first_follow',
    tier: 'bronze',
    threshold: 1,
    xpReward: 30,
  },
  {
    achievementSlug: 'first_follow',
    tier: 'silver',
    threshold: 5,
    xpReward: 60,
  },
  {
    achievementSlug: 'first_follow',
    tier: 'gold',
    threshold: 10,
    xpReward: 120,
  },

  // Daily voice (streak)
  {
    achievementSlug: 'daily_voice',
    tier: 'bronze',
    threshold: 7,
    xpReward: 100,
  },
  {
    achievementSlug: 'daily_voice',
    tier: 'silver',
    threshold: 30,
    xpReward: 300,
  },
  {
    achievementSlug: 'daily_voice',
    tier: 'gold',
    threshold: 100,
    xpReward: 1000,
  },
  {
    achievementSlug: 'daily_voice',
    tier: 'platinum',
    threshold: 365,
    xpReward: 5000,
  },

  // Viral
  {
    achievementSlug: 'viral_post',
    tier: 'bronze',
    threshold: 100,
    xpReward: 100,
  },
  {
    achievementSlug: 'viral_post',
    tier: 'silver',
    threshold: 500,
    xpReward: 250,
  },
  {
    achievementSlug: 'viral_post',
    tier: 'gold',
    threshold: 1000,
    xpReward: 500,
  },

  // Bookmarked
  {
    achievementSlug: 'bookmarked_post',
    tier: 'bronze',
    threshold: 10,
    xpReward: 100,
  },
  {
    achievementSlug: 'bookmarked_post',
    tier: 'silver',
    threshold: 50,
    xpReward: 300,
  },
  {
    achievementSlug: 'bookmarked_post',
    tier: 'gold',
    threshold: 100,
    xpReward: 500,
  },

  // Multimedia
  {
    achievementSlug: 'multimedia_poster',
    tier: 'bronze',
    threshold: 5,
    xpReward: 50,
  },
  {
    achievementSlug: 'multimedia_poster',
    tier: 'silver',
    threshold: 20,
    xpReward: 150,
  },
  {
    achievementSlug: 'multimedia_poster',
    tier: 'gold',
    threshold: 50,
    xpReward: 300,
  },

  // Hashtag
  {
    achievementSlug: 'hashtag_user',
    tier: 'bronze',
    threshold: 10,
    xpReward: 50,
  },
  {
    achievementSlug: 'hashtag_user',
    tier: 'silver',
    threshold: 50,
    xpReward: 150,
  },
  {
    achievementSlug: 'hashtag_user',
    tier: 'gold',
    threshold: 100,
    xpReward: 300,
  },
]

async function main() {
  console.log('Seeding achievements...')

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    })
  }

  console.log('Seeding tiers...')

  for (const tier of tiers) {
    const achievement = await prisma.achievement.findUnique({
      where: { slug: tier.achievementSlug },
    })

    if (achievement) {
      await prisma.achievementTier.upsert({
        where: {
          achievementId_tier: {
            achievementId: achievement.id,
            tier: tier.tier,
          },
        },
        update: {
          threshold: tier.threshold,
          xpReward: tier.xpReward,
        },
        create: {
          achievementId: achievement.id,
          tier: tier.tier,
          threshold: tier.threshold,
          xpReward: tier.xpReward,
        },
      })
    }
  }

  console.log('Seeding completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
