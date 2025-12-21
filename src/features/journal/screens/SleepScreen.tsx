import { View, Text, Pressable, TextInput } from 'react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Frown, Meh, Smile } from 'lucide-react-native'

import { Button } from '@shared/components/Button'
import { JournalLayout } from '@features/journal/components/JournalLayout'
import { colors } from '@theme/colors'

type SleepQuality = 'bad' | 'neutral' | 'good'

export default function SleepScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [hours, setHours] = useState('')
  const [quality, setQuality] = useState<SleepQuality | null>(null)

  const handleSave = () => {
    if (hours && quality) {
      // TODO: Save to API
      console.log('Sleep data:', { hours: parseFloat(hours), quality })
      router.back()
    }
  }

  const qualityOptions: { value: SleepQuality; icon: typeof Frown; label: string }[] = [
    { value: 'bad', icon: Frown, label: t('journal.sleep.quality.bad') },
    { value: 'neutral', icon: Meh, label: t('journal.sleep.quality.neutral') },
    { value: 'good', icon: Smile, label: t('journal.sleep.quality.good') },
  ]

  return (
    <JournalLayout title={t('journal.sleep.screenTitle')}>
      {/* Hours Input */}
      <View className="mb-8">
        <Text className="text-base font-medium text-text mb-3">{t('journal.sleep.hours')}</Text>
        <TextInput
          value={hours}
          onChangeText={setHours}
          keyboardType="decimal-pad"
          placeholder="8"
          className="bg-surface border border-border rounded-lg px-4 py-4 text-lg text-text"
          placeholderTextColor={colors.textLight}
        />
      </View>

      {/* Quality Selector */}
      <View className="mb-8">
        <Text className="text-base font-medium text-text mb-3">{t('journal.sleep.question')}</Text>
        <View className="flex-row gap-3">
          {qualityOptions.map(({ value, icon: Icon, label }) => (
            <Pressable
              key={value}
              onPress={() => setQuality(value)}
              className={`flex-1 items-center justify-center py-6 rounded-xl border-2 ${
                quality === value ? 'border-primary bg-primary/10' : 'border-border bg-surface'
              }`}
              accessibilityLabel={label}
              accessibilityRole="button"
            >
              <Icon
                size={40}
                color={quality === value ? colors.primary : colors.textMuted}
                strokeWidth={2}
              />
              <Text
                className={`text-sm mt-3 ${
                  quality === value ? 'text-primary font-medium' : 'text-text-muted'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <Button title={t('common.save')} onPress={handleSave} disabled={!hours || !quality} />
    </JournalLayout>
  )
}
