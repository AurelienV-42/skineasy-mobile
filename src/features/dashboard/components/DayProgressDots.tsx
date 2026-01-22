import { addDays, isSameDay, startOfWeek } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface DayProgressDotsProps {
  selectedDate: Date
  onDateSelect?: (date: Date) => void
}

export function DayProgressDots({
  selectedDate,
  onDateSelect,
}: DayProgressDotsProps): React.ReactElement {
  const { i18n } = useTranslation()
  const isFrench = i18n.language === 'fr'

  // Get start of week (Monday for FR, Sunday for EN)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: isFrench ? 1 : 0 })

  // Generate 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Day labels (Monday-first for FR, Sunday-first for EN)
  const dayLabels = isFrench
    ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const today = new Date()

  return (
    <View className="flex-row justify-around px-4 py-3">
      {weekDays.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate)
        const isToday = isSameDay(date, today)
        const isPast = date < today && !isToday

        return (
          <Pressable
            key={index}
            onPress={() => onDateSelect?.(date)}
            haptic="light"
            className="items-center gap-1 min-w-8"
          >
            <Text
              className={`text-xs font-medium ${
                isSelected ? 'text-text font-bold' : isToday ? 'text-primary' : 'text-text-muted'
              }`}
            >
              {dayLabels[index]}
            </Text>
            <View className="flex-row gap-0.5">
              {/* Placeholder dots - would show actual data in future */}
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isPast || isToday ? colors.primary : `${colors.text}20`,
                }}
              />
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isPast ? `${colors.primary}60` : `${colors.text}20`,
                }}
              />
            </View>
            {isSelected && <View className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
          </Pressable>
        )
      })}
    </View>
  )
}
