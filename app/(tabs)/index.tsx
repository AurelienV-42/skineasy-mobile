import { View, Text, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Moon, UtensilsCrossed, Dumbbell } from 'lucide-react-native'

import { useUserStore } from '@shared/stores/user.store'
import { JournalCard } from '@shared/components/JournalCard'
import { QuizBanner } from '@shared/components/QuizBanner'
import { logger } from '@shared/utils/logger'
import { colors } from '@theme/colors'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  const handleQuizPress = () => {
    // TODO: Navigate to typeform webview
    logger.info('Quiz banner pressed')
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-text mb-2">
            {t('dashboard.greeting', { name: user?.firstname || 'User' })}
          </Text>
          <Text className="text-sm text-text-muted mb-6">{t('dashboard.reminder')}</Text>

          {/* Journal Cards - Single Row */}
          <Text className="text-lg font-semibold text-text mb-4">Daily Journal</Text>
          <View className="flex-row gap-3 mb-8">
            <JournalCard
              icon={<Moon size={48} color={colors.primary} strokeWidth={1.5} />}
              title={t('journal.sleep.title')}
              onPress={() => router.push('/journal/sleep')}
            />
            <JournalCard
              icon={<UtensilsCrossed size={48} color={colors.primary} strokeWidth={1.5} />}
              title={t('journal.nutrition.title')}
              onPress={() => router.push('/journal/nutrition')}
            />
            <JournalCard
              icon={<Dumbbell size={48} color={colors.primary} strokeWidth={1.5} />}
              title={t('journal.sport.title')}
              onPress={() => router.push('/journal/sport')}
            />
          </View>

          {/* Quiz Banner */}
          <View className="mb-8">
            <QuizBanner onPress={handleQuizPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
