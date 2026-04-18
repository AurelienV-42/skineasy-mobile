import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  deleteAccount,
  updateProfile,
  uploadAvatar as uploadAvatarApi,
} from '@features/profile/data/profile.api';
import type { EditProfileInput } from '@features/profile/schemas/profile.schema';
import { toast } from '@lib/toast';
import { queryKeys } from '@shared/config/queryKeys';
import { useAuthStore } from '@shared/stores/auth.store';
import { useUserStore } from '@shared/stores/user.store';
import { logger } from '@shared/utils/logger';

export function useUpdateProfile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: EditProfileInput) => {
      const { email: _, ...updateData } = data;
      logger.info('[useUpdateProfile] Updating profile with:', updateData);
      const updated = await updateProfile(updateData);
      logger.info('[useUpdateProfile] Profile updated:', updated);
      return updated;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success(t('profile.updateSuccess'), t('profile.updateSuccessMessage'));
    },
    onError: (error: Error) => {
      logger.error('[useUpdateProfile] Error:', error);
      toast.error(t('common.error'), t('profile.updateError'));
    },
  });
}

export function useUploadAvatar() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (uri: string) => {
      const { avatar_url } = await uploadAvatarApi(uri);
      return avatar_url;
    },
    onSuccess: (avatarUrl) => {
      toast.success(t('profile.updateSuccess'));
      if (user) {
        setUser({ ...user, avatar_url: avatarUrl });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error: Error) => {
      logger.error('[useUploadAvatar] Error:', error);
      toast.error(t('common.error'), t('profile.avatarUploadError'));
    },
  });
}

export function useDeleteAccount() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearUser = useUserStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      logger.info('[useDeleteAccount] Deleting account...');
      await deleteAccount();
      logger.info('[useDeleteAccount] Account deleted successfully');
    },
    onSuccess: async () => {
      await clearAuth();
      clearUser();
      toast.success(t('profile.deleteAccountSuccess'), t('profile.deleteAccountSuccessMessage'));
      router.replace('/(auth)/login');
    },
    onError: (error: Error) => {
      logger.error('[useDeleteAccount] Error:', error);
      toast.error(t('common.error'), t('profile.deleteAccountError'));
    },
  });
}
