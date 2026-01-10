import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { journalService } from '@features/journal/services/journal.service'
import { queryKeys } from '@shared/config/queryKeys'
import type { CreateSportEntryDto } from '@shared/types/journal.types'
import { fromISOToDateString } from '@shared/utils/date'
import { haptic } from '@shared/utils/haptic'
import { logger } from '@shared/utils/logger'

export function useSportTypes() {
  const { t } = useTranslation()

  return useQuery({
    queryKey: queryKeys.sportTypes(),
    queryFn: async () => {
      const sportTypes = await journalService.sportTypes.getAll()

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
          logger.info(`[useSportTypes] All ${validation.total} sport types validated successfully`)
        }
      }

      return sportTypes
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  })
}

export function useSportEntries(date: string) {
  return useQuery({
    queryKey: queryKeys.journalSport(date),
    queryFn: () => journalService.sport.getByDate(date),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateSport() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (dto: CreateSportEntryDto) => journalService.sport.create(dto),
    onSuccess: (data, variables) => {
      logger.info('[useCreateSport] Success:', data)

      const dateKey = fromISOToDateString(variables.date)
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSport(dateKey) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(dateKey) })

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

export function useUpdateSport() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateSportEntryDto>; date: string }) =>
      journalService.sport.update(id, dto),
    onSuccess: (data, variables) => {
      logger.info('[useUpdateSport] Success:', data)

      queryClient.invalidateQueries({ queryKey: queryKeys.journalSport(variables.date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.journalEntries(variables.date) })

      haptic.success()
      Toast.show({
        type: 'success',
        text1: t('journal.sport.saveSuccess'),
      })
    },
    onError: (error) => {
      logger.error('[useUpdateSport] Error:', error)
      haptic.error()
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('journal.sport.saveError'),
      })
    },
  })
}

export function useDeleteSport() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id }: { id: number; date: string }) => journalService.sport.delete(id),
    onSuccess: (_, variables) => {
      logger.info('[useDeleteSport] Success')

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
