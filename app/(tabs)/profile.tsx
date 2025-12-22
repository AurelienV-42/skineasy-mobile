import { useRouter } from 'expo-router'
import {
  Bug,
  ChevronRight,
  FileText,
  Languages,
  Lock,
  LogOut,
  Shield,
  Trash2,
  UserPen
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Alert, Linking, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as Sentry from '@sentry/react-native'
import { Pressable } from '@shared/components/Pressable'
import { useAuthStore } from '@shared/stores/auth.store'
import { useUserStore } from '@shared/stores/user.store'
import { colors } from '@theme/colors'

export default function ProfileScreen() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const currentLanguage =
    i18n.language === 'fr' ? t('profile.languageFrench') : t('profile.languageEnglish')

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(newLang)
  }

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

  const handleTestSentry = () => {
    Alert.alert(
      'Test Sentry Error Tracking',
      'This will send a test error to Sentry. Choose a test type:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Test Error',
          onPress: () => {
            Sentry.captureException(new Error('Test error from DEV mode'))
            Alert.alert('Success', 'Test error sent to Sentry!')
          },
        },
        {
          text: 'Test Message',
          onPress: () => {
            Sentry.captureMessage('Test message from DEV mode', 'info')
            Alert.alert('Success', 'Test message sent to Sentry!')
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 pt-4">
        <Text className="text-2xl font-bold text-text mb-6 px-4">{t('profile.title')}</Text>

        {/* User Info */}
        {!!user && (
          <View className="px-4 mb-8">
            <Text className="text-lg font-medium text-text">
              {user?.firstname} {user?.lastname}
            </Text>
            <Text className="text-sm text-textMuted">{user?.email}</Text>
            {user?.skinType && (
              <Text className="text-sm text-primary mt-1">
                {t('profile.skinType')}: {user.skinType}
              </Text>
            )}
          </View>
        )}

        {/* Menu Items */}
        <View className="bg-surface mb-4">
          <Pressable
            onPress={() => router.push('/profile/edit')}
            haptic="medium"
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-3">
              <UserPen size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.editProfile')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={handleLanguageChange}
            haptic="light"
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Languages size={20} color={colors.primary} />
              <Text className="text-base text-text">{t('profile.language')}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-text-muted">{currentLanguage}</Text>
              <ChevronRight size={20} color={colors.textMuted} />
            </View>
          </Pressable>
        </View>

        {/* Legal Section */}
        <View className="bg-surface mb-4">
          <Pressable
            onPress={() => openUrl(t('profile.termsOfSaleUrl'))}
            haptic="medium"
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
            haptic="medium"
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
            haptic="medium"
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
            haptic="heavy"
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-3">
              <LogOut size={20} color={colors.error} />
              <Text className="text-base text-error">{t('profile.logout')}</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleDeleteAccount}
            haptic="heavy"
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Trash2 size={20} color={colors.error} />
              <Text className="text-base text-error">{t('profile.deleteAccount')}</Text>
            </View>
          </Pressable>
        </View>

        {/* DEV Only - Sentry Test Button */}
        {__DEV__ && (
          <View className="bg-surface mt-4">
            <Pressable
              onPress={handleTestSentry}
              haptic="light"
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <Bug size={20} color={colors.warning} />
                <Text className="text-base text-warning">Test Sentry (DEV only)</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
