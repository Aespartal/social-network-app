import { postService } from '@/services/post.service'
import { useCallback, useState } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
}

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true)
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const loadFeed = useCallback(
    async (isInitial = true) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined

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

        const response = await postService.getFeed({ cursor, limit: 10 })

        if (timeoutId) clearTimeout(timeoutId)

        setPosts(prev =>
          isInitial ? response.posts : [...prev, ...response.posts]
        )
        setHasMorePosts(response.posts.length === 10)
      } catch {
        setError('Error al cargar el feed')
      } finally {
        if (timeoutId) clearTimeout(timeoutId)
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
      await postService.toggleLike(postId)
    } catch {
      loadFeed(true)
    }
  }

  const handleToggleBookmark = async (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, isBookmarked: !p.isBookmarked }
        }
        return p
      })
    )
    try {
      await postService.toggleBookmark(postId)
    } catch {
      // Error silencioso o revertir localmente
    }
  }

  const handleCreatePost = async (
    content: string,
    parentId?: string,
    imageFile?: File
  ) => {
    try {
      setIsCreating(true)
      setError('')

      const newPost = await postService.createPost({
        content,
        parentId,
        imageFile,
        tags: [],
      })

      if (parentId) {
        setPosts(prev =>
          prev.map(p => {
            if (p.id === parentId) {
              return { ...p, repliesCount: (p.repliesCount || 0) + 1 }
            }
            return p
          })
        )
      } else {
        setPosts(prev => [newPost, ...prev])
      }

      return { success: true }
    } catch (err: unknown) {
      const axiosError = err as ApiError
      const msg = axiosError.response?.data?.error || 'Error al publicar'
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
    handleToggleBookmark,
    handleCreatePost,
  }
}
