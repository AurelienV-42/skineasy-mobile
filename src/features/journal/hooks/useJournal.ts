/**
 * Journal TanStack Query Hooks
 *
 * Provides React Query hooks for journal entries (sleep, sport, meal)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { journalService } from '@features/journal/services/journal.service'
import { queryKeys } from '@shared/config/queryKeys'
import { logger } from '@shared/utils/logger'
import { haptic } from '@shared/utils/haptic'
import Toast from 'react-native-toast-message'
import type {
  CreateSleepEntryDto,
  CreateSportEntryDto,
  CreateMealEntryDto,
} from '@shared/types/journal.types'
import { useTranslation } from 'react-i18next'

/**
 * Sleep Entry Hooks
 */

/**
 * Fetch sleep entries for a specific date
 */
export function useSleepEntries(date: string) {
  return useQuery({
    queryKey: queryKeys.journalSleep(date),
    queryFn: () => journalService.sleep.getByDate(date),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Create or update sleep entry (upsert)
 */
export function useUpsertSleep() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (dto: CreateSleepEntryDto) => journalService.sleep.upsert(dto),
    onSuccess: (data, variables) => {
      logger.info('[useUpsertSleep] Success:', data)

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSleep(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      // Show success feedback
      haptic.success()
      Toast.show({
        type: 'success',
        text1: t('journal.sleep.saveSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useUpsertSleep] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.sleep.saveError'),
      })
    },
  })
}

/**
 * Delete sleep entry
 */
export function useDeleteSleep() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id }: { id: number; date: string }) => journalService.sleep.delete(id),
    onSuccess: (_, variables) => {
      logger.info('[useDeleteSleep] Success')

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSleep(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.light()
      Toast.show({
        type: 'success',
        text1: t('journal.sleep.deleteSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useDeleteSleep] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.sleep.deleteError'),
      })
    },
  })
}

/**
 * Sport Entry Hooks
 */

/**
 * Fetch available sport types from backend
 * Returns full sport type objects with id, name, created_at
 * Validates that all sport types have translations and icons in DEV mode
 */
export function useSportTypes() {
  const { t } = useTranslation()

  return useQuery({
    queryKey: queryKeys.sportTypes(),
    queryFn: async () => {
      const sportTypes = await journalService.sportTypes.getAll()

      // Validate mappings in DEV mode
      if (__DEV__) {
        const { validateSportMappings } = await import('@features/journal/utils/sportMapping')
        const sportTypeNames = sportTypes.map((st) => st.name)
        const validation = validateSportMappings(sportTypeNames, t)

        if (!validation.valid) {
          logger.warn(
            `[useSportTypes] ${validation.total} sport types from backend, ` +
              `${validation.configured} configured, ` +
              `${validation.missingConfig.length} missing config, ` +
              `${validation.missingTranslations.length} missing translations`
          )
        } else {
          logger.info(
            `[useSportTypes] All ${validation.total} sport types validated successfully ✓`
          )
        }
      }

      return sportTypes
    },
    staleTime: Infinity, // Sport types don't change often
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  })
}

/**
 * Fetch sport entries for a specific date
 */
export function useSportEntries(date: string) {
  return useQuery({
    queryKey: queryKeys.journalSport(date),
    queryFn: () => journalService.sport.getByDate(date),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Create sport entry
 */
export function useCreateSport() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (dto: CreateSportEntryDto) => journalService.sport.create(dto),
    onSuccess: (data, variables) => {
      logger.info('[useCreateSport] Success:', data)

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSport(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.success()
      Toast.show({
        type: 'success',
        text1: t('journal.sport.saveSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useCreateSport] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.sport.saveError'),
      })
    },
  })
}

/**
 * Delete sport entry
 */
export function useDeleteSport() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id }: { id: number; date: string }) => journalService.sport.delete(id),
    onSuccess: (_, variables) => {
      logger.info('[useDeleteSport] Success')

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSport(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.light()
      Toast.show({
        type: 'success',
        text1: t('journal.sport.deleteSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useDeleteSport] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.sport.deleteError'),
      })
    },
  })
}

/**
 * Meal Entry Hooks
 */

/**
 * Fetch meal entries for a specific date
 */
export function useMealEntries(date: string) {
  return useQuery({
    queryKey: queryKeys.journalMeal(date),
    queryFn: () => journalService.meal.getByDate(date),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Upload meal image
 */
export function useUploadMealImage() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (imageUri: string) => journalService.meal.uploadImage(imageUri),
    onError: (error) => {
      logger.error('[useUploadMealImage] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.nutrition.uploadError'),
      })
    },
  })
}

/**
 * Create meal entry
 */
export function useCreateMeal() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (dto: CreateMealEntryDto) => journalService.meal.create(dto),
    onSuccess: (data, variables) => {
      logger.info('[useCreateMeal] Success:', data)

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalMeal(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.success()
      Toast.show({
        type: 'success',
        text1: t('journal.nutrition.saveSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useCreateMeal] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.nutrition.saveError'),
      })
    },
  })
}

/**
 * Delete meal entry
 */
export function useDeleteMeal() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id }: { id: number; date: string }) => journalService.meal.delete(id),
    onSuccess: (_, variables) => {
      logger.info('[useDeleteMeal] Success')

      // Invalidate queries for the affected date
      queryClient.invalidateQueries({ queryKey: queryKeys.journalMeal(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.light()
      Toast.show({
        type: 'success',
        text1: t('journal.nutrition.deleteSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useDeleteMeal] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.nutrition.deleteError'),
      })
    },
  })
}
