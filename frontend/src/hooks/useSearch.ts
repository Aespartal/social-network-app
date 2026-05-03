import { useState, useCallback } from 'react'
import { postService } from '@/services/post.service'
import { Post } from 'social-network-app-shared/types/social.type'

interface SearchUser {
  id: string
  username: string
  name: string
  avatar: string | null
  verified: boolean
  isFollowing?: boolean
}

export const useSearch = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<SearchUser[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [searchType, setSearchType] = useState<
    'all' | 'posts' | 'users' | 'tags'
  >('all')

  const search = useCallback(
    async (
      query: string,
      isInitial: boolean = true,
      type: 'all' | 'posts' | 'users' | 'tags' = 'all',
      clearExisting: boolean = true
    ) => {
      if (!query.trim()) return

      try {
        if (isInitial) {
          setLoading(true)
          if (clearExisting) {
            setPosts([])
            setUsers([])
            setTags([])
          }
        } else {
          setLoadingMore(true)
        }

        setError(null)
        setSearchType(type)

        const response = await postService.search(query, {
          type,
          limit: 20,
        })

        if (type === 'all' || type === 'posts') {
          if (isInitial) {
            setPosts(response.posts || [])
          } else {
            setPosts(prev => [...prev, ...(response.posts || [])])
          }
        }

        if (type === 'all' || type === 'users') {
          setUsers(response.users || [])
        }

        if (type === 'all' || type === 'tags') {
          setTags(response.tags || [])
        }

        setHasMore((response.posts?.length || 0) >= 20)
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { error?: string } } }).response?.data
            ?.error || 'Error al buscar'
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    []
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
    users,
    tags,
    loading,
    loadingMore,
    error,
    hasMore,
    searchType,
    search,
    handleToggleLike,
    handleToggleBookmark,
  }
}
