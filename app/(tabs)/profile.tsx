import { View, Text, Pressable, Alert, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  ChevronRight,
  RefreshCw,
  FileText,
  Shield,
  Lock,
  LogOut,
  Trash2,
} from 'lucide-react-native'

import { useUserStore } from '@shared/stores/user.store'
import { useAuthStore } from '@shared/stores/auth.store'
import { colors } from '@theme/colors'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = () => {
    Alert.alert(t('profile.logoutTitle'), t('profile.logoutConfirm'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await clearAuth()
          clearUser()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(t('profile.deleteAccountTitle'), t('profile.deleteAccountConfirm'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          // TODO: Call delete account API
          await clearAuth()
          clearUser()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const openUrl = (url: string) => {
    Linking.openURL(url)
  }

  const getInitials = () => {
    if (!user) return '?'
    return `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 pt-4">
        <Text className="text-2xl font-bold text-text mb-6 px-4">{t('profile.title')}</Text>

        {/* User Info */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-white">{getInitials()}</Text>
          </View>
          <Text className="text-lg font-medium text-text">
            {user?.firstname} {user?.lastname}
          </Text>
          <Text className="text-sm text-text-muted">{user?.email}</Text>
          {user?.skinType && (
            <Text className="text-sm text-primary mt-1">
              {t('profile.skinType')}: {user.skinType}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View className="bg-surface mb-4">
          <Pressable className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-row items-center gap-3">
              <RefreshCw size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.retakeDiagnosis')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Legal Section */}
        <View className="bg-surface mb-4">
          <Pressable
            onPress={() => openUrl(t('profile.termsOfSaleUrl'))}
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-3">
              <FileText size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.termsOfSale')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={() => openUrl(t('profile.termsOfUseUrl'))}
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-3">
              <Shield size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.termsOfUse')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={() => openUrl(t('profile.privacyPolicyUrl'))}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Lock size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.privacyPolicy')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Account Actions */}
        <View className="bg-surface">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-3">
              <LogOut size={20} color={colors.error} />
              <Text className="text-base text-error">{t('profile.logout')}</Text>
            </View>
          </Pressable>

          <Pressable onPress={handleDeleteAccount} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Trash2 size={20} color={colors.error} />
              <Text className="text-base text-error">{t('profile.deleteAccount')}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
