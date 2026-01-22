import { useRouter } from 'expo-router'
import { Layers } from 'lucide-react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DateNavigation } from '@features/dashboard/components/DateNavigation'
import { DayProgressDots } from '@features/dashboard/components/DayProgressDots'
import { IndicatorsList } from '@features/dashboard/components/IndicatorsList'
import { RecipeOfTheDay } from '@features/dashboard/components/RecipeOfTheDay'
import { ScoreContainer } from '@features/dashboard/components/ScoreContainer'
import { SectionHeader } from '@features/dashboard/components/SectionHeader'
import {
  useMealEntries,
  useSleepEntries,
  useSportEntries,
} from '@features/journal/hooks/useJournal'
import { Avatar } from '@shared/components/Avatar'
import { useEntranceAnimation } from '@shared/hooks/useEntranceAnimation'
import { useUserStore } from '@shared/stores/user.store'
import { toUTCDateString } from '@shared/utils/date'

export default function DashboardScreen(): React.ReactElement {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const animStyles = useEntranceAnimation(6)

  // Selected date state
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Convert selected date to UTC string for API
  const dateString = toUTCDateString(selectedDate)

  // Fetch journal data for selected date
  const { data: sleepEntries = [] } = useSleepEntries(dateString)
  const { data: mealEntries = [] } = useMealEntries(dateString)
  const { data: sportEntries = [] } = useSportEntries(dateString)

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-24">
          {/* Top bar: Date Navigation + Avatar */}
          <Animated.View
            style={animStyles[0]}
            className="px-4 flex-row justify-between items-center"
          >
            <DateNavigation selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <Avatar
              firstname={user?.firstname}
              lastname={user?.lastname}
              email={user?.email}
              size={32}
              onPress={() => router.push('/profile')}
            />
          </Animated.View>

          {/* Day Progress Dots */}
          <Animated.View style={animStyles[1]}>
            <DayProgressDots selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </Animated.View>

          {/* Score Container */}
          <Animated.View style={animStyles[2]}>
            <ScoreContainer score={40} />
          </Animated.View>

          {/* Indicators Section */}
          <Animated.View style={animStyles[3]}>
            <SectionHeader icon={Layers} title={t('dashboard.indicators.title')} />
            <IndicatorsList
              sleepEntries={sleepEntries}
              mealEntries={mealEntries}
              sportEntries={sportEntries}
              date={dateString}
            />
          </Animated.View>

          {/* Recipe of the Day */}
          <Animated.View style={animStyles[5]}>
            <RecipeOfTheDay />
          </Animated.View>

          {/* Routine Banner */}
          {/* <Animated.View style={animStyles[4]} className="px-4">
            <RoutineBannerContainer />
          </Animated.View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
