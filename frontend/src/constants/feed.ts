export enum FeedType {
  ALL = 'all',
  FOLLOWING = 'following',
}

export const FEED_TABS_CONFIG = [
  { id: 0, type: FeedType.ALL, label: 'Para ti' },
  { id: 1, type: FeedType.FOLLOWING, label: 'Siguiendo' },
] as const

export type FeedTabId = (typeof FEED_TABS_CONFIG)[number]['id']
