import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { authService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import { queryKeys } from '@shared/config/queryKeys'

/**
 * Hook to initialize user data on app start
 * Fetches user profile from /me endpoint when authenticated
 */
export function useInitializeUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isAuthLoading = useAuthStore((state) => state.isLoading)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)
  const user = useUserStore((state) => state.user)

  console.log('[useInitializeUser] Hook state:', {
    isAuthenticated,
    isAuthLoading,
    hasUser: !!user,
    userId: user?.id,
  })

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      console.log('[useInitializeUser] Fetching user data from /me endpoint')
      const result = await authService.getMe()
      console.log('[useInitializeUser] /me response:', result)
      return result
    },
    enabled: isAuthenticated && !isAuthLoading,
    retry: 1,
    staleTime: Infinity, // User data doesn't change often
  })

  console.log('[useInitializeUser] Query state:', {
    isLoading,
    isFetching,
    hasData: !!data,
    hasError: !!error,
    errorMessage: error?.message,
  })

  useEffect(() => {
    if (data) {
      console.log('[useInitializeUser] Setting user data in store:', data.data)
      setUser(data.data)
    }
  }, [data, setUser])

  useEffect(() => {
    if (error) {
      console.log('[useInitializeUser] Error fetching user, clearing user data:', error)
      // If /me fails, clear user data (likely token is invalid)
      clearUser()
    }
  }, [error, clearUser])

  return {
    isLoading: isAuthLoading || isLoading,
    error,
  }
}
