import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'

import { authService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import { queryKeys } from '@shared/config/queryKeys'
import type { LoginInput } from '@features/auth/schemas/auth.schema'
import { haptic } from '@shared/utils/haptic'

export function useLogin() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useUserStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      console.log('[useLogin] Attempting login with:', { email: data.email })
      try {
        const loginResponse = await authService.login(data)
        console.log('[useLogin] Login response:', loginResponse)
        const { accessToken, refreshToken, user } = loginResponse.data
        await setTokens(accessToken, refreshToken)
        console.log('[useLogin] User data:', user)
        return user
      } catch (error) {
        console.log('[useLogin] Error:', error)
        throw error
      }
    },
    onSuccess: (user) => {
      haptic.success()
      setUser(user)
      // Invalidate user query to trigger refetch and keep cache in sync
      queryClient.invalidateQueries({ queryKey: queryKeys.user })
    },
    onError: () => {
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('auth.invalidCredentials'),
      })
    },
  })
}
