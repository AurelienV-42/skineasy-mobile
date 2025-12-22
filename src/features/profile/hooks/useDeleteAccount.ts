import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'

import { profileService } from '@features/profile/services/profile.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import { haptic } from '@shared/utils/haptic'
import { logger } from '@shared/utils/logger'

export function useDeleteAccount() {
  const { t } = useTranslation()
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clearUser)

  return useMutation({
    mutationFn: async () => {
      logger.info('[useDeleteAccount] Deleting account...')
      await profileService.deleteAccount()
      logger.info('[useDeleteAccount] Account deleted successfully')
    },
    onSuccess: async () => {
      haptic.success()
      await clearAuth()
      clearUser()
      Toast.show({
        type: 'success',
        text1: t('profile.deleteAccountSuccess'),
        text2: t('profile.deleteAccountSuccessMessage'),
      })
      router.replace('/(auth)/login')
    },
    onError: (error: Error) => {
      haptic.error()
      logger.error('[useDeleteAccount] Error:', error)
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('profile.deleteAccountError'),
      })
    },
  })
}
