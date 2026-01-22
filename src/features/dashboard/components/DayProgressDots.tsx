import { format, isSameDay, subDays } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { DayProgressCircle } from '@features/dashboard/components/DayProgressCircle'
import { Pressable } from '@shared/components/Pressable'

type DayScore = {
  date: Date
  score: number // 0-100
}

// Example scores for demo
const today = new Date()
const EXAMPLE_SCORES: DayScore[] = [
  { date: subDays(today, 6), score: 100 },
  { date: subDays(today, 5), score: 100 },
  { date: subDays(today, 4), score: 60 },
  { date: subDays(today, 3), score: 75 },
  { date: subDays(today, 2), score: 30 },
  { date: subDays(today, 1), score: 100 },
  { date: today, score: 40 },
]

interface DayProgressDotsProps {
  onDateSelect?: (date: Date) => void
  scores?: DayScore[]
}

export function DayProgressDots({
  onDateSelect,
  scores = EXAMPLE_SCORES,
}: DayProgressDotsProps): React.ReactElement {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'fr' ? fr : enUS
  const currentDay = new Date()

  // Generate 7 days ending with today (6 days ago to today)
  const weekDays = Array.from({ length: 7 }, (_, i) => subDays(currentDay, 6 - i))

  const getScoreForDate = (date: Date): number => {
    const found = scores.find((s) => isSameDay(s.date, date))
    return found?.score ?? 0
  }

  return (
    <View className="flex-row justify-between px-4 py-2">
      {weekDays.map((date, index) => {
        const isToday = isSameDay(date, currentDay)
        const dayLabel = format(date, 'EEEEE', { locale })
        const score = getScoreForDate(date)

        return (
          <Pressable
            key={index}
            onPress={() => onDateSelect?.(date)}
            haptic="light"
            className="items-center gap-1"
          >
            <DayProgressCircle score={score} isToday={isToday} />
            <Text className="text-xs font-medium text-text-muted">{dayLabel.toUpperCase()}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
