import { postsAPI } from '@/services/api'
import { useCallback, useState } from 'react'
import { Post } from 'social-network-app-shared/types/social'

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true)
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const loadFeed = useCallback(
    async (isInitial = true) => {
      let timeoutId: NodeJS.Timeout

      try {
        if (isInitial) {
          timeoutId = setTimeout(() => setLoading(true), 250)
        } else {
          setLoadingMore(true)
        }

        const cursor =
          !isInitial && posts.length > 0
            ? posts[posts.length - 1].id
            : undefined
        const response = await postsAPI.getFeed({ cursor, limit: 10 })

        if (timeoutId!) clearTimeout(timeoutId)

        setPosts(prev =>
          isInitial ? response.posts : [...prev, ...response.posts]
        )
        setHasMorePosts(response.posts.length === 10)
      } catch (err) {
        setError('Error al cargar')
      } finally {
        if (timeoutId!) clearTimeout(timeoutId)
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [posts]
  )

  const handleToggleLike = async (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          }
        }
        return p
      })
    )

    try {
      await postsAPI.toggleLike(postId)
    } catch (err) {
      loadFeed(true)
    }
  }

  const handleCreatePost = async (content: string) => {
    try {
      setIsCreating(true)
      setError('')
      const newPost = await postsAPI.createPost({ content })
      setPosts(prev => [newPost, ...prev])
      return { success: true }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al publicar'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsCreating(false)
    }
  }

  return {
    posts,
    loading,
    loadingMore,
    isCreating,
    error,
    hasMorePosts,
    loadFeed,
    handleToggleLike,
    handleCreatePost,
  }
}
