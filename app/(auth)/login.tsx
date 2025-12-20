import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginScreen() {
  const { t } = useTranslation()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-text mb-8">SkinEasy</Text>
        <Text className="text-lg text-text-muted mb-12">{t('auth.login')}</Text>

        {/* Placeholder - Form will be added in Phase 4 */}
        <View className="w-full bg-surface rounded-md p-4 mb-4">
          <Text className="text-text-muted text-center">Login form coming soon</Text>
        </View>

        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text className="text-primary">
              {t('auth.noAccount')} <Text className="font-bold">{t('auth.register')}</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  )
}
