import { useEffect } from 'react'
import { postService } from '@/services'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query'
import { Post, PostResponse } from 'social-network-app-shared/types/social.type'
import { useAuth } from './useAuth'
import { FeedType, FEED_TABS_CONFIG } from '@/constants/feed'

export const useFeed = (activeTab: number) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const feedType = FEED_TABS_CONFIG[activeTab]?.type || FeedType.ALL

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', feedType],
    queryFn: async ({ pageParam }) => {
      const response =
        feedType === 'following'
          ? await postService.getFollowingFeed({
              cursor: pageParam as string,
              limit: 10,
            })
          : await postService.getFeed({
              cursor: pageParam as string,
              limit: 10,
            })
      return response
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.meta?.nextCursor ?? undefined,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (isAuthenticated) {
      refetch()
    }
  }, [isAuthenticated, activeTab, refetch])

  const posts = data?.pages.flatMap(page => page.posts) || []

  const { mutateAsync: handleCreatePost, isPending: isCreating } = useMutation({
    mutationFn: async (args: {
      content: string
      parentId?: string
      imageFile?: File
    }) => {
      return postService.createPost({
        content: args.content,
        parentId: args.parentId,
        imageFile: args.imageFile,
        tags: [],
      })
    },
    onSuccess: (newPost, variables) => {
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['post', variables.parentId],
        })
        queryClient.setQueryData(
          ['posts', feedType],
          (oldData: InfiniteData<PostResponse> | undefined) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                posts: page.posts.map((p: Post) =>
                  p.id === variables.parentId
                    ? { ...p, repliesCount: (p.repliesCount || 0) + 1 }
                    : p
                ),
              })),
            }
          }
        )
      } else {
        queryClient.setQueryData(
          ['posts', feedType],
          (oldData: InfiniteData<PostResponse> | undefined) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page, index: number) =>
                index === 0
                  ? { ...page, posts: [newPost, ...page.posts] }
                  : page
              ),
            }
          }
        )
      }
    },
  })

  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (postId: string) => postService.toggleLike(postId),
    onMutate: async postId => {
      await queryClient.cancelQueries({ queryKey: ['posts', feedType] })
      const previousData = queryClient.getQueryData(['posts', feedType])

      queryClient.setQueryData(
        ['posts', feedType],
        (oldData: InfiniteData<PostResponse> | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              posts: page.posts.map((p: Post) => {
                if (p.id === postId) {
                  const isLiked = !p.isLiked
                  return {
                    ...p,
                    isLiked,
                    likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
                  }
                }
                return p
              }),
            })),
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _postId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts', feedType], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', feedType] })
    },
  })

  const { mutate: handleToggleBookmark } = useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),
    onMutate: async postId => {
      await queryClient.cancelQueries({ queryKey: ['posts', feedType] })
      const previousData = queryClient.getQueryData(['posts', feedType])

      queryClient.setQueryData(
        ['posts', feedType],
        (oldData: InfiniteData<PostResponse> | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              posts: page.posts.map((p: Post) =>
                p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
              ),
            })),
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _postId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts', feedType], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', feedType] })
    },
  })

  const wrappedCreatePost = async (
    content: string,
    parentId?: string,
    imageFile?: File
  ) => {
    try {
      await handleCreatePost({ content, parentId, imageFile })
      return { success: true }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error || 'Error al publicar'
      return { success: false, error: errorMsg }
    }
  }

  return {
    posts,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    isCreating,
    error: error ? 'Error al cargar el feed' : '',
    hasMorePosts: !!hasNextPage,
    loadFeed: (isInitial: boolean) => (isInitial ? refetch() : fetchNextPage()),
    handleToggleLike: (postId: string) => handleToggleLike(postId),
    handleToggleBookmark: (postId: string) => handleToggleBookmark(postId),
    handleCreatePost: wrappedCreatePost,
  }
}
