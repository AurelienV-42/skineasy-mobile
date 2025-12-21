import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DailySummary } from '@features/dashboard/components/DailySummary'
import { DateNavigation } from '@features/dashboard/components/DateNavigation'
import {
  useMealEntries,
  useSleepEntries,
  useSportEntries,
} from '@features/journal/hooks/useJournal'
import { QuizBanner } from '@shared/components/QuizBanner'
import { useUserStore } from '@shared/stores/user.store'
import { toUTCDateString } from '@shared/utils/date'
import { logger } from '@shared/utils/logger'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const user = useUserStore((state) => state.user)

  // Selected date state
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Convert selected date to UTC string for API
  const dateString = toUTCDateString(selectedDate)

  // Fetch journal data for selected date
  const { data: sleepEntries = [], isLoading: sleepLoading } = useSleepEntries(dateString)
  const { data: mealEntries = [], isLoading: mealLoading } = useMealEntries(dateString)
  const { data: sportEntries = [], isLoading: sportLoading } = useSportEntries(dateString)

  const isLoading = sleepLoading || mealLoading || sportLoading

  const handleQuizPress = () => {
    // TODO: Navigate to typeform webview
    logger.info('Quiz banner pressed')
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-text mb-1">
            {t('dashboard.greeting', { name: user?.firstname || 'User' })}
          </Text>
          <Text className="text-sm text-textMuted">{t('dashboard.reminder')}</Text>
        </View>

        {/* Date Navigation */}
        <DateNavigation selectedDate={selectedDate} onDateChange={setSelectedDate} />
        {/* Daily Summary - Expandable Cards */}
        <View className="pt-2">
          <Text className="text-lg font-semibold text-text mb-4 px-4">
            {t('dashboard.summary.title')}
          </Text>
          <DailySummary
            key={dateString}
            sleepEntries={sleepEntries}
            mealEntries={mealEntries}
            sportEntries={sportEntries}
            isLoading={isLoading}
            date={dateString}
          />
        </View>

        {/* Quiz Banner */}
        <View className="px-4 py-4">
          <QuizBanner onPress={handleQuizPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
