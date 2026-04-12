/**
 * Prisma Query Helpers
 *
 * Shared constants and helpers for Prisma queries in Posts module.
 * Eliminates duplication between Repository and QueryService.
 */

/**
 * Standard author field selection for posts
 * Reusable across all queries that include author info
 */
export const AUTHOR_SELECT = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  verified: true,
} as const

/**
 * Basic author field selection (without id and verified)
 * Used when we don't need full author context
 */
export const AUTHOR_SELECT_BASIC = {
  id: true,
  username: true,
  name: true,
  avatar: true,
} as const

/**
 * Post include configuration for commands (Repository)
 * Includes full author info and aggregates
 */
export const COMMAND_POST_INCLUDE = {
  author: { select: AUTHOR_SELECT },
  tags: { include: { tag: true } },
} as const

/**
 * Parent post include for nested queries
 * Used when loading posts with parent context
 */
export const PARENT_POST_INCLUDE = {
  author: { select: AUTHOR_SELECT_BASIC },
} as const

/**
 * Pagination constants
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const

/**
 * Validates page size and returns clamped value
 */
export function validatePageSize(limit: number | undefined): number {
  if (!limit) return PAGINATION.DEFAULT_PAGE_SIZE
  if (limit < PAGINATION.MIN_PAGE_SIZE) return PAGINATION.MIN_PAGE_SIZE
  if (limit > PAGINATION.MAX_PAGE_SIZE) return PAGINATION.MAX_PAGE_SIZE
  return limit
}

/**
 * Validates page limit is within allowed range
 * Returns true if invalid (out of range)
 */
export function isInvalidPageLimit(limit: number): boolean {
  return limit < PAGINATION.MIN_PAGE_SIZE || limit > PAGINATION.MAX_PAGE_SIZE
}

/**
 * Common Prisma query where clause for active posts
 */
export const ACTIVE_POST_WHERE = {
  deletedAt: null,
} as const

/**
 * Common Prisma query where clause for top-level posts
 */
export const TOP_LEVEL_POST_WHERE = {
  deletedAt: null,
  parentId: null,
} as const

/**
 * Sort order constants for Prisma queries
 */
export const SORT_ORDER = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
}

/**
 * Interaction types for posts
 */
export const INTERACTION_TYPE = {
  LIKE: 'like' as const,
  BOOKMARK: 'bookmark' as const,
} as const

/**
 * Time period constants for queries
 */
export const TIME_PERIOD = {
  SEVEN_DAYS_MS: 7 * 24 * 60 * 60 * 1000,
} as const

/**
 * Gets date N days ago from now
 */
export function getDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

/**
 * Transaction options for Prisma
 */
export const TRANSACTION_OPTIONS = {
  DEFAULT: {
    isolationLevel: 'ReadCommitted' as const,
    timeout: 10000,
  },
  SHORT: {
    isolationLevel: 'ReadCommitted' as const,
    timeout: 5000,
  },
} as const
