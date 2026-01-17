import { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions<T> {
  initialData?: T | null
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useApi<T = unknown, P extends unknown[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialData = null, onSuccess, onError } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: P) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const result = await apiFunction(...args)
        setState({ data: result, loading: false, error: null })
        onSuccess?.(result)
        return result
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido'
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
        onError?.(error instanceof Error ? error : new Error(errorMessage))
        throw error
      }
    },
    [apiFunction, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null })
  }, [initialData])

  return {
    ...state,
    execute,
    reset,
    setData: (data: T | null) => setState(prev => ({ ...prev, data })),
    setError: (error: string | null) =>
      setState(prev => ({ ...prev, error })),
  }
}
