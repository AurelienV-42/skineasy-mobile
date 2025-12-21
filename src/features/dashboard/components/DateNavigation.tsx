/**
 * Date Navigation Component
 *
 * Hybrid date selector with:
 * - Swipeable date strip with left/right arrows
 * - Tap to open native date picker
 * - Smart labels (Today, Yesterday, Tomorrow)
 * - Haptic feedback
 */

import { View, Text, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Calendar } from 'lucide-react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { format, isToday, isYesterday, isTomorrow, subDays } from 'date-fns'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface DateNavigationProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1))
  }

  const handleTodayPress = () => {
    onDateChange(new Date())
  }

  const handleDatePress = () => {
    setShowPicker(true)
  }

  const handlePickerChange = (_event: unknown, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    if (date) {
      onDateChange(date)
    }
  }

  const getDateLabel = (): string => {
    if (isToday(selectedDate)) return t('dashboard.today')
    if (isYesterday(selectedDate)) return t('dashboard.yesterday')
    if (isTomorrow(selectedDate)) return t('dashboard.tomorrow')
    return format(selectedDate, 'MMM d, yyyy')
  }

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center justify-between bg-surface rounded-2xl border border-border p-2">
        {/* Previous Day */}
        <Pressable
          onPress={handlePrevDay}
          haptic="light"
          className="w-10 h-10 items-center justify-center"
          accessibilityLabel={t('dashboard.navigation.previousDay')}
        >
          <ChevronLeft size={20} color={colors.text} />
        </Pressable>

        {/* Date Display */}
        <Pressable
          onPress={handleDatePress}
          haptic="light"
          className="flex-1 flex-row items-center justify-center gap-2 px-4"
          accessibilityLabel={t('dashboard.navigation.selectDate')}
        >
          <Calendar size={16} color={colors.primary} />
          <Text className="text-base font-medium text-text">{getDateLabel()}</Text>
        </Pressable>

        {/* Today button (only show if not viewing today) */}
        {!isToday(selectedDate) ? (
          <Pressable
            onPress={handleTodayPress}
            haptic="light"
            className="px-3 h-10 items-center justify-center bg-primary/10 rounded-lg"
            accessibilityLabel={t('dashboard.today')}
          >
            <Text className="text-xs font-medium text-primary">{t('dashboard.today')}</Text>
          </Pressable>
        ) : (
          <View className="w-10 h-10" />
        )}
      </View>

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerChange}
          maximumDate={new Date()}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <View className="bg-surface rounded-2xl border border-border mt-2 p-4">
          <Pressable
            onPress={() => setShowPicker(false)}
            haptic="light"
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-medium">{t('common.done')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
