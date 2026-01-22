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
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Dumbbell } from 'lucide-react-native'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { SportTypeSelector } from '@features/journal/components/SportTypeSelector'
import {
  useCreateSport,
  useSportEntries,
  useSportTypes,
  useUpdateSport,
} from '@features/journal/hooks/useJournal'
import { sportFormSchema, type SportFormInput } from '@features/journal/schemas/journal.schema'
import { enrichSportTypes } from '@features/journal/utils/sportMapping'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import type { SportIntensity } from '@shared/types/journal.types'
import { getTodayUTC, toISODateString } from '@shared/utils/date'

const INTENSITY_LEVELS = [1, 2, 3, 4, 5] as const

export default function SportScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useLocalSearchParams<{ id?: string; date?: string }>()
  const createSport = useCreateSport()
  const updateSport = useUpdateSport()
  const { data: sportTypes } = useSportTypes()

  // If editing, fetch existing entry
  const dateToUse = params.date || getTodayUTC()
  const { data: sportEntries } = useSportEntries(dateToUse)
  const existingEntry = sportEntries?.find((e) => e.id === Number(params.id))
  const isEditMode = !!params.id

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
    reset,
  } = useForm<SportFormInput>({
    resolver: zodResolver(sportFormSchema),
    mode: 'onChange',
    defaultValues: {
      intensity: 3, // Default intensity to 3 (moderate)
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (existingEntry) {
      reset({
        type: existingEntry.sportType.name as SportFormInput['type'],
        duration: String(existingEntry.duration),
        intensity: existingEntry.intensity as SportIntensity,
        note: existingEntry.note || '',
      })
    }
  }, [existingEntry, reset])

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedIntensity = watch('intensity') ?? 3

  const onSubmit = (data: SportFormInput) => {
    // Get backend ID from sport type name
    const sportTypeId = sportTypeIdMap.get(data.type)

    if (!sportTypeId) {
      // This shouldn't happen if validation is correct
      return
    }

    const dto = {
      date: toISODateString(dateToUse),
      sport_type_id: sportTypeId,
      duration: Number(data.duration),
      intensity: data.intensity as SportIntensity,
      note: data.note || null,
    }

    if (isEditMode && existingEntry) {
      // Update existing entry
      updateSport.mutate(
        { id: existingEntry.id, dto, date: dateToUse },
        {
          onSuccess: () => {
            router.back()
          },
        }
      )
    } else {
      // Create new entry
      createSport.mutate(dto, {
        onSuccess: () => {
          router.back()
        },
      })
    }
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
    <ScreenHeader title={t('journal.sport.screenTitle')} icon={Dumbbell}>
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
        disabled={!isValid || createSport.isPending || updateSport.isPending}
        loading={createSport.isPending || updateSport.isPending}
      />
    </ScreenHeader>
  )
}
