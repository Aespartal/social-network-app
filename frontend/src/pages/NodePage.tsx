import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Text as Typography } from '@/components/ui'
import { Container, Skeleton } from '@mui/material'
import { nodeService, type AuraNode } from '@/services/node.service'
import { useAuth, useSearch } from '@/hooks'
import { HomeFeed } from '@/components/social/home/HomeFeed'
import { Post } from 'social-network-app-shared/types/social.type'
import { CreatePostAction } from '@/components/social/post/CreatePostAction'
import { postService } from '@/services/post.service'
import { NodeHero } from '@/components/social/home/parts/NodeHero'
import { NodeEmptyState } from '@/components/social/home/parts/NodeEmptyState'

export const NodePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [node, setNode] = useState<AuraNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [tuning, setTuning] = useState(false)
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)

  const {
    posts,
    loading: loadingPosts,
    hasMore,
    search,
    handleToggleLike,
    handleToggleBookmark,
    loadingMore,
  } = useSearch()

  useEffect(() => {
    const fetchNode = async () => {
      if (!slug) return
      setLoading(true)
      try {
        const res = await nodeService.getBySlug(slug)
        if (res.success && res.data) {
          setNode(res.data)
        } else {
          navigate(`/search?q=${slug}&type=posts`, { replace: true })
        }
      } catch (err) {
        console.error(err)
        navigate(`/search?q=${slug}&type=posts`, { replace: true })
      } finally {
        setLoading(false)
      }
    }

    fetchNode()
  }, [slug, navigate])

  useEffect(() => {
    if (slug) {
      search(slug, true, 'posts')
    }
  }, [slug, search])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && slug) {
      search(slug, false, 'posts', false)
    }
  }, [loadingMore, slug, search])

  const [isCreating, setIsCreating] = useState(false)

  const handleCreatePost = async (
    content: string,
    parentId?: string,
    imageFile?: File
  ) => {
    setIsCreating(true)
    try {
      // Auto-append the node's hashtag if the user didn't include it
      const hashtag = `#${slug}`
      const finalContent = content.toLowerCase().includes(hashtag.toLowerCase())
        ? content
        : `${content}\n\n${hashtag}`

      await postService.createPost({
        content: finalContent,
        parentId,
        imageFile,
        tags: [slug || ''],
      })
      // Refresh feed
      if (slug) {
        search(slug, true, 'posts')
      }
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: 'Error al publicar' }
    } finally {
      setIsCreating(false)
    }
  }

  const handleTuneIn = async () => {
    if (!isAuthenticated) return
    if (!node || tuning) return

    setTuning(true)
    try {
      const res = await nodeService.tune(node.slug)
      if (res.success && res.data) {
        setNode({ ...node, isTuned: res.data.isTuned })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTuning(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Skeleton
          variant='rectangular'
          height={200}
          sx={{ borderRadius: 4, mb: 4 }}
        />
        <Skeleton variant='text' height={40} width='60%' />
        <Skeleton variant='text' height={20} width='40%' />
      </Container>
    )
  }

  if (!node) return null

  return (
    <Box sx={{ pb: 8 }}>
      <NodeHero
        node={node}
        isAuthenticated={isAuthenticated}
        tuning={tuning}
        onTuneIn={handleTuneIn}
      />

      <Container maxWidth='md'>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
              Actividad Reciente
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Explora las publicaciones más recientes de la comunidad.
            </Typography>
          </Box>
          <CreatePostAction
            onSave={handleCreatePost}
            loading={isCreating}
            replyToPost={replyToPost}
            onCloseReply={() => setReplyToPost(null)}
          />
        </Box>

        {!loadingPosts && posts.length === 0 ? (
          <NodeEmptyState node={node} />
        ) : (
          <HomeFeed
            loading={loadingPosts}
            posts={posts}
            onLike={handleToggleLike}
            onBookmark={handleToggleBookmark}
            onReply={setReplyToPost}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </Container>
    </Box>
  )
}
