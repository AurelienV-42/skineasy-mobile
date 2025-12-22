/**
 * Sleep Screen
 *
 * Allows users to log sleep data with:
 * - Hours of sleep (decimal input)
 * - Sleep quality (1-5 scale: 1=Bad, 3=Neutral, 5=Good)
 *
 * Connected to real backend API with validation
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Frown, Meh, Smile } from 'lucide-react-native'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { useSleepEntries, useUpsertSleep } from '@features/journal/hooks/useJournal'
import { sleepFormSchema, type SleepFormInput } from '@features/journal/schemas/journal.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import type { SleepQuality } from '@shared/types/journal.types'
import { getTodayUTC, toISODateString } from '@shared/utils/date'
import { colors } from '@theme/colors'

const QUALITY_LEVELS = [
  { value: 1 as SleepQuality, icon: Frown, labelKey: 'journal.sleep.quality.bad' },
  { value: 3 as SleepQuality, icon: Meh, labelKey: 'journal.sleep.quality.neutral' },
  { value: 5 as SleepQuality, icon: Smile, labelKey: 'journal.sleep.quality.good' },
]

export default function SleepScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useLocalSearchParams<{ id?: string; date?: string }>()
  const upsertSleep = useUpsertSleep()

  // If editing, fetch existing entry
  const dateToUse = params.date || getTodayUTC()
  const { data: sleepEntries } = useSleepEntries(dateToUse)
  const existingEntry = sleepEntries?.find((e) => e.id === Number(params.id))

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<SleepFormInput>({
    resolver: zodResolver(sleepFormSchema),
    mode: 'onChange',
    defaultValues: {
      quality: 3, // Default to Neutral
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (existingEntry) {
      reset({
        hours: String(existingEntry.hours),
        quality: existingEntry.quality as SleepQuality,
      })
    }
  }, [existingEntry, reset])

  const selectedQuality = watch('quality') ?? 3

  const onSubmit = (data: SleepFormInput) => {
    const dto = {
      date: toISODateString(dateToUse),
      hours: Number(data.hours),
      quality: data.quality as SleepQuality,
    }

    upsertSleep.mutate(dto, {
      onSuccess: () => {
        router.back()
      },
    })
  }

  return (
    <ScreenHeader title={t('journal.sleep.screenTitle')}>
      {/* Hours Input */}
      <View className="mb-8">
        <Controller
          control={control}
          name="hours"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('journal.sleep.hours')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={errors.hours?.message ? t(errors.hours.message as string) : undefined}
            />
          )}
        />
      </View>

      {/* Quality Selector */}
      <View className="mb-8">
        <Text className="text-sm font-medium text-text mb-3">{t('journal.sleep.question')}</Text>
        <View className="flex-row gap-3">
          {QUALITY_LEVELS.map(({ value, icon: Icon, labelKey }) => (
            <Pressable
              key={value}
              onPress={() => setValue('quality', value)}
              haptic="light"
              className={`flex-1 items-center justify-center py-6 rounded-xl border-2 ${
                selectedQuality === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface'
              }`}
              accessibilityLabel={t(labelKey)}
              accessibilityRole="button"
            >
              <Icon
                size={40}
                color={selectedQuality === value ? colors.primary : colors.textMuted}
                strokeWidth={2}
              />
              <Text
                className={`text-sm mt-3 ${
                  selectedQuality === value ? 'text-primary font-medium' : 'text-textMuted'
                }`}
              >
                {t(labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <Button
        title={t('common.save')}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || upsertSleep.isPending}
        loading={upsertSleep.isPending}
      />
    </ScreenHeader>
  )
}
