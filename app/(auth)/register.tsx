import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function RegisterScreen() {
  const { t } = useTranslation()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-text mb-8">SkinEasy</Text>
        <Text className="text-lg text-text-muted mb-12">{t('auth.register')}</Text>

        {/* Placeholder - Form will be added in Phase 4 */}
        <View className="w-full bg-surface rounded-md p-4 mb-4">
          <Text className="text-text-muted text-center">Register form coming soon</Text>
        </View>

        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text className="text-primary">
              {t('auth.hasAccount')} <Text className="font-bold">{t('auth.login')}</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  )
}
