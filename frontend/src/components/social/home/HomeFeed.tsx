import React from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { FeedSkeleton } from '../skeleton/FeedSkeleton'
import { PostList } from '../post/PostList'

interface HomeFeedProps {
  loading: boolean
  posts: Post[]
  onLike: (id: string) => void
  onBookmark: (id: string) => void
  onReply: (post: Post) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  loading,
  posts,
  ...props
}) => {
  if (loading && posts.length === 0) {
    return <FeedSkeleton />
  }

  return <PostList posts={posts} {...props} />
}
