import { useCallback, useRef } from 'react'

interface UseInfiniteScrollProps {
  hasMore: boolean
  isLoading: boolean
  onIntersect: () => void
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onIntersect,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onIntersect()
          }
        },
        { rootMargin: '100px' }
      )

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, onIntersect]
  )

  return { lastElementRef }
}
