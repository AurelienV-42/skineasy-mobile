import { useRouter } from 'expo-router'
import { Dumbbell, Moon, Utensils } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Dimensions, View } from 'react-native'

import { IndicatorCard } from '@features/dashboard/components/IndicatorCard'
import type { MealEntry, SleepEntry, SportEntry } from '@shared/types/journal.types'

type IndicatorStatus = 'empty' | 'partial' | 'complete'

const SCREEN_WIDTH = Dimensions.get('window').width
const HORIZONTAL_PADDING = 16
const GAP = 8
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / 2

interface IndicatorsListProps {
  sleepEntries: SleepEntry[]
  mealEntries: MealEntry[]
  sportEntries: SportEntry[]
  date: string
}

export function IndicatorsList({
  sleepEntries,
  mealEntries,
  sportEntries,
  date,
}: IndicatorsListProps): React.ReactElement {
  const { t } = useTranslation()
  const router = useRouter()

  // Calculate values from entries
  const sleepHours = sleepEntries.length > 0 ? sleepEntries[0].hours : 0
  const sleepValue =
    sleepHours > 0
      ? `${Math.floor(sleepHours)}h${Math.round((sleepHours % 1) * 60)
          .toString()
          .padStart(2, '0')}`
      : '-'

  const mealCount = mealEntries.length
  const mealValue = mealCount > 0 ? `${mealCount}/5` : '-'

  const totalSportMinutes = sportEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0)
  const sportValue = totalSportMinutes > 0 ? `${totalSportMinutes} min` : '-'

  const navigateToJournal = (type: 'sleep' | 'nutrition' | 'sport'): void => {
    const paths = {
      sleep: '/journal/sleep',
      nutrition: '/journal/nutrition',
      sport: '/journal/sport',
    }
    router.push({ pathname: paths[type], params: { date } })
  }

  // Compute status for each card
  const sleepStatus: IndicatorStatus = sleepEntries.length > 0 ? 'complete' : 'empty'
  const nutritionStatus: IndicatorStatus =
    mealCount >= 3 ? 'complete' : mealCount > 0 ? 'partial' : 'empty'
  const sportStatus: IndicatorStatus = sportEntries.length > 0 ? 'complete' : 'empty'

  // Display value for nutrition partial state
  const nutritionValue =
    nutritionStatus === 'partial'
      ? t('dashboard.indicators.mealsEntered', { count: mealCount })
      : mealValue

  return (
    <View className="px-4 gap-2">
      {/* Top row: Sleep + Nutrition */}
      <View className="flex-row gap-2">
        <View style={{ width: CARD_WIDTH }}>
          <IndicatorCard
            icon={Moon}
            label={t('dashboard.indicators.sleep')}
            value={sleepValue}
            onPress={() => navigateToJournal('sleep')}
            status={sleepStatus}
          />
        </View>
        <View style={{ width: CARD_WIDTH }}>
          <IndicatorCard
            icon={Utensils}
            label={t('dashboard.indicators.nutrition')}
            value={nutritionValue}
            onPress={() => navigateToJournal('nutrition')}
            status={nutritionStatus}
          />
        </View>
      </View>

      {/* Bottom row: Sport (half width) */}
      <View className="flex-row gap-2">
        <View style={{ width: CARD_WIDTH }}>
          <IndicatorCard
            icon={Dumbbell}
            label={t('dashboard.indicators.sport')}
            value={sportValue}
            onPress={() => navigateToJournal('sport')}
            status={sportStatus}
          />
        </View>
        {/* Empty spacer for equal width */}
        <View style={{ width: CARD_WIDTH }} />
      </View>
    </View>
  )
}
