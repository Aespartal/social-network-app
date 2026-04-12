import { postService } from '@/services'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

export const useExplore = () => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', 'trending'],
    queryFn: async ({ pageParam }) => {
      return await postService.getTrendingPosts({
        cursor: pageParam as string,
        limit: 10,
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.meta?.nextCursor ?? undefined,
  })

  const posts = data?.pages.flatMap(page => page.posts) || []

  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (postId: string) => postService.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'trending'] })
    },
  })

  const { mutate: handleToggleBookmark } = useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'trending'] })
    },
  })

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'trending'] })
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
    error: error ? 'Error al cargar tendencias' : '',
    hasMorePosts: !!hasNextPage,
    loadMore: fetchNextPage,
    refresh: refetch,
    handleToggleLike,
    handleToggleBookmark,
    handleCreatePost: wrappedCreatePost,
    isCreating,
  }
}
