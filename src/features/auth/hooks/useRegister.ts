import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'

import { authService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import type { RegisterInput } from '@features/auth/schemas/auth.schema'

export function useRegister() {
  const { t } = useTranslation()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useUserStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const registerResponse = await authService.register(data)
      const { accessToken, refreshToken, user } = registerResponse.data
      await setTokens(accessToken, refreshToken)
      return user
    },
    onSuccess: (user) => {
      setUser(user)
      Toast.show({
        type: 'success',
        text1: t('auth.registerSuccess'),
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('auth.registerError'),
      })
    },
  })
}
