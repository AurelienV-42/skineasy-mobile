import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'

import { authService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import type { LoginInput } from '@features/auth/schemas/auth.schema'

export function useLogin() {
  const { t } = useTranslation()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useUserStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const loginResponse = await authService.login(data)
      await setTokens(loginResponse.access_token)
      const user = await authService.getMe()
      return user
    },
    onSuccess: (user) => {
      setUser(user)
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error.message || t('auth.invalidCredentials'),
      })
    },
  })
}
