import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DailySummary } from '@features/dashboard/components/DailySummary'
import { DateNavigation } from '@features/dashboard/components/DateNavigation'
import {
  useDeleteMeal,
  useDeleteSleep,
  useDeleteSport,
  useMealEntries,
  useSleepEntries,
  useSportEntries,
} from '@features/journal/hooks/useJournal'
import { RoutineBannerContainer } from '@features/routine/components/RoutineBannerContainer'
import { useEntranceAnimation } from '@shared/hooks/useEntranceAnimation'
import { useUserStore } from '@shared/stores/user.store'
import type { MealEntry, SleepEntry, SportEntry } from '@shared/types/journal.types'
import { toUTCDateString } from '@shared/utils/date'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const animStyles = useEntranceAnimation(4)

  // Selected date state
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Convert selected date to UTC string for API
  const dateString = toUTCDateString(selectedDate)

  // Fetch journal data for selected date
  const { data: sleepEntries = [], isLoading: sleepLoading } = useSleepEntries(dateString)
  const { data: mealEntries = [], isLoading: mealLoading } = useMealEntries(dateString)
  const { data: sportEntries = [], isLoading: sportLoading } = useSportEntries(dateString)

  // Delete mutations
  const deleteSleep = useDeleteSleep()
  const deleteMeal = useDeleteMeal()
  const deleteSport = useDeleteSport()

  const isLoading = sleepLoading || mealLoading || sportLoading

  // Delete handlers
  const handleDeleteSleep = (id: number) => {
    deleteSleep.mutate({ id, date: dateString })
  }

  const handleDeleteMeal = (id: number) => {
    deleteMeal.mutate({ id, date: dateString })
  }

  const handleDeleteSport = (id: number) => {
    deleteSport.mutate({ id, date: dateString })
  }

  // Edit handlers - navigate to edit screens with entry data
  const handleEditSleep = (entry: SleepEntry) => {
    router.push({ pathname: '/journal/sleep', params: { id: entry.id, date: dateString } })
  }

  const handleEditMeal = (entry: MealEntry) => {
    router.push({ pathname: '/journal/nutrition', params: { id: entry.id, date: dateString } })
  }

  const handleEditSport = (entry: SportEntry) => {
    router.push({ pathname: '/journal/sport', params: { id: entry.id, date: dateString } })
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <Animated.View style={animStyles[0]} className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-text mb-1">
            {t('dashboard.greeting', { name: user?.firstname || 'User' })}
          </Text>
          <Text className="text-sm text-textMuted">{t('dashboard.reminder')}</Text>
        </Animated.View>

        {/* Date Navigation */}
        <Animated.View style={animStyles[1]}>
          <DateNavigation selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </Animated.View>

        {/* Daily Summary - Expandable Cards */}
        <Animated.View style={animStyles[2]} className="pt-2">
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
            onDeleteSleep={handleDeleteSleep}
            onDeleteMeal={handleDeleteMeal}
            onDeleteSport={handleDeleteSport}
            onEditSleep={handleEditSleep}
            onEditMeal={handleEditMeal}
            onEditSport={handleEditSport}
          />
        </Animated.View>

        {/* Routine Banner */}
        <Animated.View style={animStyles[3]} className="px-4 py-4">
          <RoutineBannerContainer />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}
