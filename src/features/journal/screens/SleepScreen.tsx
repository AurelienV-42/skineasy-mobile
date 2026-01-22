/**
 * Sleep Screen
 *
 * Allows users to log sleep data with:
 * - Hours of sleep (time picker)
 * - Sleep quality (1-5 scale: 1=Bad, 3=Neutral, 5=Good)
 *
 * Connected to real backend API with validation
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Frown, Meh, Moon, Smile } from 'lucide-react-native'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { useSleepEntries, useUpsertSleep } from '@features/journal/hooks/useJournal'
import { sleepFormSchema, type SleepFormInput } from '@features/journal/schemas/journal.schema'
import { Button } from '@shared/components/Button'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import { SelectableCard } from '@shared/components/SelectableCard'
import { TimePicker } from '@shared/components/TimePicker'
import type { SleepQuality } from '@shared/types/journal.types'
import { getTodayUTC, toISODateString } from '@shared/utils/date'

const QUALITY_LEVELS = [
  { value: 1 as SleepQuality, icon: Frown, labelKey: 'journal.sleep.quality.bad' },
  { value: 3 as SleepQuality, icon: Meh, labelKey: 'journal.sleep.quality.neutral' },
  { value: 5 as SleepQuality, icon: Smile, labelKey: 'journal.sleep.quality.good' },
]

const DEFAULT_MINUTES = 480 // 8 hours

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
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
    reset,
  } = useForm<SleepFormInput>({
    resolver: zodResolver(sleepFormSchema),
    mode: 'onChange',
    defaultValues: {
      minutes: DEFAULT_MINUTES,
      quality: 3,
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (existingEntry) {
      // Convert decimal hours to minutes
      const minutes = Math.round(existingEntry.hours * 60)
      reset({
        minutes,
        quality: existingEntry.quality as SleepQuality,
      })
    }
  }, [existingEntry, reset])

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedMinutes = watch('minutes') ?? DEFAULT_MINUTES
  const selectedQuality = watch('quality') ?? 3

  const onSubmit = (data: SleepFormInput) => {
    // Convert minutes to decimal hours for API
    const hours = data.minutes / 60

    const dto = {
      date: toISODateString(dateToUse),
      hours,
      quality: data.quality as SleepQuality,
    }

    upsertSleep.mutate(dto, {
      onSuccess: () => {
        router.back()
      },
    })
  }

  return (
    <ScreenHeader title={t('journal.sleep.screenTitle')} icon={Moon}>
      {/* Sleep Duration Picker */}
      <View className="mb-8">
        <TimePicker
          value={selectedMinutes}
          onChange={(val) => setValue('minutes', val, { shouldValidate: true })}
          label={t('journal.sleep.hours')}
          title={t('journal.sleep.pickerTitle')}
        />
      </View>

      {/* Quality Selector */}
      <View className="mb-8">
        <Text className="font-medium text-text mb-3">{t('journal.sleep.question')}</Text>
        <View className="flex-row gap-3">
          {QUALITY_LEVELS.map(({ value, icon, labelKey }) => (
            <View key={value} className="flex-1">
              <SelectableCard
                selected={selectedQuality === value}
                onPress={() => setValue('quality', value)}
                label={t(labelKey)}
                icon={icon}
                variant="vertical"
                iconSize={40}
              />
            </View>
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
