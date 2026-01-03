import { useState, useCallback, useEffect } from 'react'
import { Post } from 'social-network-app-shared/types/social.type'
import { postService } from '@/services/post.service'
import { useFeed } from '@/hooks/useFeed'

export const usePostDetail = (id: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)

  const { handleToggleLike, handleToggleBookmark } = useFeed()

  const loadPostData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await postService.getPostWithReplies(id)
      setPost(data)
    } catch (err) {
      console.error('Error cargando el post:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPostData()
    window.scrollTo(0, 0)
  }, [id])

  const handleLike = async (postId: string) => {
    await handleToggleLike(postId)
    await loadPostData()
  }

  const handleBookmark = async (postId: string) => {
    await handleToggleBookmark(postId)
    await loadPostData()
  }

  const handleReply = async (post: Post) => {
    setReplyToPost(post)
  }

  const handleSaveReply = async (
    content: string,
    parentId?: string
  ): Promise<{ success: boolean }> => {
    await postService.createPost({ content, parentId })
    await loadPostData()
    return { success: true }
  }

  return {
    post,
    loading,
    replyToPost,
    setReplyToPost,
    handleLike,
    handleBookmark,
    handleReply,
    handleSaveReply,
  }
}
