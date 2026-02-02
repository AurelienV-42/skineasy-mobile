import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { Calendar, type DateData } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CalendarDayDetail } from '@features/calendar/components/CalendarDayDetail'
import { useMonthScores } from '@features/calendar/hooks/useMonthScores'
import { colors } from '@theme/colors'

export default function CalendarScreen(): React.ReactElement {
  const { t } = useTranslation()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'))
  const [visibleMonth, setVisibleMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  })

  const { markedDates, isLoading } = useMonthScores(visibleMonth.year, visibleMonth.month)

  const handleDayPress = (day: DateData): void => {
    setSelectedDate(day.dateString)
  }

  const handleMonthChange = (month: DateData): void => {
    setVisibleMonth({ year: month.year, month: month.month - 1 })
  }

  const finalMarkedDates = useMemo(
    () => ({
      ...markedDates,
      [selectedDate]: {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      },
    }),
    [markedDates, selectedDate]
  )

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-2">
        <Text className="text-xl font-bold text-brown-dark">{t('calendar.title')}</Text>
      </View>

      <Calendar
        markingType="multi-dot"
        markedDates={finalMarkedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        enableSwipeMonths
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.textMuted,
          dayTextColor: colors.text,
          todayTextColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.white,
          monthTextColor: colors.brownDark,
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          arrowColor: colors.brownDark,
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">...</Text>
        </View>
      ) : (
        <CalendarDayDetail date={selectedDate} />
      )}
    </SafeAreaView>
  )
}
