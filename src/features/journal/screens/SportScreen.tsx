/**
 * Sport Screen
 *
 * Allows users to log physical exercise activities with:
 * - Sport type selector (premium hybrid UI)
 * - Duration input (minutes)
 * - Intensity selector (1-5 scale)
 *
 * Connected to real backend API with validation
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { SportTypeSelector } from '@features/journal/components/SportTypeSelector'
import { useCreateSport, useSportTypes } from '@features/journal/hooks/useJournal'
import { sportFormSchema, type SportFormInput } from '@features/journal/schemas/journal.schema'
import { enrichSportTypes } from '@features/journal/utils/sportMapping'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { JournalLayout } from '@shared/components/ScreenHeader'
import type { SportIntensity } from '@shared/types/journal.types'
import { getTodayUTC } from '@shared/utils/date'
import { useMemo } from 'react'

const INTENSITY_LEVELS = [1, 2, 3, 4, 5] as const

export default function SportScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const createSport = useCreateSport()
  const { data: sportTypes } = useSportTypes()

  // Create a map of sport type names to backend IDs
  const sportTypeIdMap = useMemo(() => {
    if (!sportTypes) return new Map<string, number>()
    const enriched = enrichSportTypes(sportTypes, t)
    return new Map(enriched.map((st) => [st.id, st.backendId]))
  }, [sportTypes, t])

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SportFormInput>({
    resolver: zodResolver(sportFormSchema),
    mode: 'onChange',
    defaultValues: {
      intensity: 3, // Default intensity to 3 (moderate)
    },
  })

  const selectedIntensity = watch('intensity') ?? 3

  const onSubmit = (data: SportFormInput) => {
    // Get backend ID from sport type name
    const sportTypeId = sportTypeIdMap.get(data.type)

    if (!sportTypeId) {
      // This shouldn't happen if validation is correct
      return
    }

    const dto = {
      date: getTodayUTC(),
      sport_type_id: sportTypeId,
      duration: Number(data.duration),
      intensity: data.intensity as SportIntensity,
      note: data.note || null,
    }

    createSport.mutate(dto, {
      onSuccess: () => {
        router.back()
      },
    })
  }

  const getIntensityLabel = (level: number): string => {
    const labels = [
      t('journal.sport.intensity.veryLight'),
      t('journal.sport.intensity.light'),
      t('journal.sport.intensity.moderate'),
      t('journal.sport.intensity.hard'),
      t('journal.sport.intensity.veryHard'),
    ]
    return labels[level - 1] || ''
  }

  return (
    <JournalLayout title={t('journal.sport.screenTitle')}>
      {/* Sport Type Selector */}
      <View className="mb-6">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <SportTypeSelector value={value} onChange={onChange} />
          )}
        />
      </View>

      {/* Duration Input */}
      <View className="mb-6">
        <Controller
          control={control}
          name="duration"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={`${t('journal.sport.duration')} (${t('journal.sport.minutes')})`}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              placeholder="30"
              error={errors.duration?.message ? t(errors.duration.message as string) : undefined}
            />
          )}
        />
      </View>

      {/* Intensity Selector */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-text mb-3">
          {t('journal.sport.intensity.label')}
        </Text>

        <View className="flex-row justify-between gap-2">
          {INTENSITY_LEVELS.map((level) => (
            <Pressable
              key={level}
              onPress={() => setValue('intensity', level)}
              haptic="light"
              className={`flex-1 items-center justify-center py-3 rounded-lg border ${
                selectedIntensity === level
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
              accessibilityLabel={`${t('journal.sport.intensity.label')} ${level}`}
              accessibilityRole="button"
            >
              <Text
                className={`text-2xl font-bold ${
                  selectedIntensity === level ? 'text-white' : 'text-text'
                }`}
              >
                {level}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Intensity Label */}
        <Text className="text-sm text-textMuted text-center mt-2">
          {getIntensityLabel(selectedIntensity)}
        </Text>
      </View>

      {/* Note Input */}
      <View className="mb-2">
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('journal.sport.note')}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('journal.sport.notePlaceholder')}
              multiline
              numberOfLines={3}
              error={errors.note?.message ? t(errors.note.message as string) : undefined}
            />
          )}
        />
      </View>

      {/* Save Button */}
      <Button
        title={t('common.save')}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || createSport.isPending}
        loading={createSport.isPending}
      />
    </JournalLayout>
  )
}
