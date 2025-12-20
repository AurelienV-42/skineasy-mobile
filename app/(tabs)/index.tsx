import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useUserStore } from '@shared/stores'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const user = useUserStore((state) => state.user)

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-text mb-2">
          {t('dashboard.greeting', { name: user?.firstname || 'User' })}
        </Text>
        <Text className="text-sm text-text-muted mb-6">{t('dashboard.reminder')}</Text>

        {/* Placeholder - Cards will be added in Phase 6 */}
        <View className="bg-surface rounded-md p-4 mb-4 border border-border">
          <Text className="text-base font-medium text-text">{t('journal.sleep.title')}</Text>
          <Text className="text-sm text-text-muted mt-2">{t('dashboard.comingSoon')}</Text>
        </View>

        <View className="bg-surface rounded-md p-4 mb-4 border border-border">
          <Text className="text-base font-medium text-text">{t('journal.nutrition.title')}</Text>
          <Text className="text-sm text-text-muted mt-2">{t('dashboard.comingSoon')}</Text>
        </View>

        <View className="bg-surface rounded-md p-4 mb-4 border border-border">
          <Text className="text-base font-medium text-text">{t('journal.sport.title')}</Text>
          <Text className="text-sm text-text-muted mt-2">{t('dashboard.comingSoon')}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
