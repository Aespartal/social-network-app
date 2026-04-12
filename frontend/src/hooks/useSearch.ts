import { useState, useCallback } from 'react'
import { postService } from '@/services/post.service'
import { Post } from 'social-network-app-shared/types/social.type'

export const useSearch = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)

  const search = useCallback(
    async (query: string, isInitial: boolean = true) => {
      if (!query.trim()) return

      try {
        if (isInitial) {
          setLoading(true)
          setPosts([])
        } else {
          setLoadingMore(true)
        }

        setError(null)

        const response = await postService.searchPosts(query, {
          cursor: isInitial ? undefined : nextCursor,
          limit: 20,
        })

        if (isInitial) {
          setPosts(response.posts)
        } else {
          setPosts(prev => [...prev, ...response.posts])
        }

        setNextCursor(response.meta.nextCursor || undefined)
        setHasMore(response.meta.hasMore)
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { error?: string } } }).response?.data
            ?.error || 'Error al buscar posts'
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [nextCursor]
  )

  const handleToggleLike = async (postId: string) => {
    try {
      const { isLiked, likesCount } = await postService.toggleLike(postId)
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, isLiked, likesCount } : post
        )
      )
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleToggleBookmark = async (postId: string) => {
    try {
      const { isBookmarked } = await postService.toggleBookmark(postId)
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, isBookmarked } : post
        )
      )
    } catch (err) {
      console.error('Error toggling bookmark:', err)
    }
  }

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    search,
    handleToggleLike,
    handleToggleBookmark,
  }
}
