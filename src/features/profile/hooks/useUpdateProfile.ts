import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import type { EditProfileInput } from '@features/profile/schemas/profile.schema'
import { profileService } from '@features/profile/services/profile.service'
import { queryKeys } from '@shared/config/queryKeys'
import { useUserStore } from '@shared/stores/user.store'
import { haptic } from '@shared/utils/haptic'
import { logger } from '@shared/utils/logger'

export function useUpdateProfile() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setUser = useUserStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (data: EditProfileInput) => {
      // Remove email from the request (not editable via API)
      const { email: _, ...updateData } = data
      logger.info('[useUpdateProfile] Updating profile with:', updateData)
      const response = await profileService.updateProfile(updateData)
      logger.info('[useUpdateProfile] Profile updated:', response.data)
      return response.data
    },
    onSuccess: (updatedUser) => {
      haptic.success()
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: queryKeys.user })
      Toast.show({
        type: 'success',
        text1: t('profile.updateSuccess'),
        text2: t('profile.updateSuccessMessage'),
      })
    },
    onError: (error: Error) => {
      haptic.error()
      logger.error('[useUpdateProfile] Error:', error)
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('profile.updateError'),
      })
    },
  })
}

export function useUploadAvatar() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (uri: string) => {
      const response = await profileService.uploadAvatar(uri)
      return response.data.avatar
    },
    onSuccess: (avatarUrl) => {
      haptic.success()
      if (user) {
        setUser({ ...user, avatar: avatarUrl })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user })
    },
    onError: (error: Error) => {
      haptic.error()
      logger.error('[useUploadAvatar] Error:', error)
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('profile.avatarUploadError'),
      })
    },
  })
}
