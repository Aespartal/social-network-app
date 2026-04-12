import { useState, useCallback, useEffect } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { postService } from '@/services'
import { useFeed } from '@/hooks'

export const usePostDetail = (id: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)

  const { handleToggleLike, handleToggleBookmark } = useFeed()

  const loadPostData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await postService.getPostWithReplies(id)
      if (data && data.post) {
        setPost(data.post)
        if (data.replies) {
          setReplies(data.replies.posts || [])
          setHasMore(data.replies.meta?.hasMore || false)
          setNextCursor(data.replies.meta?.nextCursor || null)
        }
      }
    } catch (err) {
      console.error('Error cargando el post:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  const loadMoreReplies = useCallback(async () => {
    if (!id || !hasMore || loadingMore || !nextCursor) return

    try {
      setLoadingMore(true)
      const data = await postService.getPostWithReplies(id, {
        cursor: nextCursor,
      })

      setReplies(prev => [...prev, ...data.replies.posts])
      setHasMore(data.replies.meta.hasMore)
      setNextCursor(data.replies.meta.nextCursor)
    } catch (err) {
      console.error('Error cargando más respuestas:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [id, hasMore, loadingMore, nextCursor])

  useEffect(() => {
    loadPostData()
    window.scrollTo(0, 0)
  }, [id])

  const handleLike = async (postId: string) => {
    await handleToggleLike(postId)
    // Update local state if it's the main post or a reply
    if (post && post.id === postId) {
      setPost(prev =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: prev.isLiked
                ? prev.likesCount - 1
                : prev.likesCount + 1,
            }
          : null
      )
    } else {
      setReplies(prev =>
        prev.map(r =>
          r.id === postId
            ? {
                ...r,
                isLiked: !r.isLiked,
                likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
              }
            : r
        )
      )
    }
  }

  const handleBookmark = async (postId: string) => {
    await handleToggleBookmark(postId)
    if (post && post.id === postId) {
      setPost(prev =>
        prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null
      )
    } else {
      setReplies(prev =>
        prev.map(r =>
          r.id === postId ? { ...r, isBookmarked: !r.isBookmarked } : r
        )
      )
    }
  }

  const handleReply = async (post: Post) => {
    setReplyToPost(post)
  }

  const handleSaveReply = async (
    content: string,
    parentId?: string
  ): Promise<{ success: boolean }> => {
    await postService.createPost({ content, parentId })
    // Refresh only if we don't want to append manually for better UX
    await loadPostData()
    return { success: true }
  }

  return {
    post,
    replies,
    loading,
    loadingMore,
    hasMore,
    loadMoreReplies,
    replyToPost,
    setReplyToPost,
    handleLike,
    handleBookmark,
    handleReply,
    handleSaveReply,
  }
}
