import { View, Text, TextInput } from 'react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'

import { Button } from '@shared/components/Button'
import { Pressable } from '@shared/components/Pressable'
import { JournalLayout } from '@shared/components/ScreenHeader'
import { colors } from '@theme/colors'

type SportActivity =
  | 'yoga'
  | 'cardio'
  | 'hiit'
  | 'pilates'
  | 'running'
  | 'walking'
  | 'strength'
  | 'swimming'
  | 'cycling'
  | 'other'

export default function SportScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedActivity, setSelectedActivity] = useState<SportActivity | null>(null)
  const [duration, setDuration] = useState('')
  const [note, setNote] = useState('')

  const activities: SportActivity[] = [
    'yoga',
    'cardio',
    'hiit',
    'pilates',
    'running',
    'walking',
    'strength',
    'swimming',
    'cycling',
    'other',
  ]

  const handleSave = () => {
    if (selectedActivity && duration) {
      // TODO: Save to API
      console.log('Sport data:', {
        activity: selectedActivity,
        duration: parseInt(duration),
        note,
      })
      router.back()
    }
  }

  return (
    <JournalLayout title={t('journal.sport.screenTitle')}>
      {/* Activity Selector */}
      <View className="mb-6">
        <Text className="text-base font-medium text-text mb-3">
          {t('journal.sport.addActivity')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {activities.map((activity) => (
            <Pressable
              key={activity}
              onPress={() => setSelectedActivity(activity)}
              className={`px-4 py-3 rounded-full border ${
                selectedActivity === activity
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
              accessibilityLabel={t(`journal.sport.activities.${activity}`)}
              accessibilityRole="button"
            >
              <Text
                className={`text-sm ${
                  selectedActivity === activity ? 'text-white font-medium' : 'text-text'
                }`}
              >
                {t(`journal.sport.activities.${activity}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Duration Input */}
      <View className="mb-6">
        <Text className="text-base font-medium text-text mb-3">
          {t('journal.sport.duration')} ({t('journal.sport.minutes')})
        </Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          placeholder="30"
          className="bg-surface border border-border rounded-lg px-4 py-4 text-lg text-text"
          placeholderTextColor={colors.textLight}
        />
      </View>

      {/* Note Input */}
      <View className="mb-8">
        <Text className="text-base font-medium text-text mb-3">{t('journal.sport.note')}</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Optional note..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-surface border border-border rounded-lg px-4 py-3 text-base text-text min-h-24"
          placeholderTextColor={colors.textLight}
        />
      </View>

      {/* Save Button */}
      <Button
        title={t('common.save')}
        onPress={handleSave}
        disabled={!selectedActivity || !duration}
      />
    </JournalLayout>
  )
}
