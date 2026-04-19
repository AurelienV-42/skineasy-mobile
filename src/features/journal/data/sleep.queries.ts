import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import * as sleepApi from '@features/journal/data/sleep.api';
import { trackMutation } from '@lib/analytics';
import { toast } from '@lib/toast';
import { queryKeys } from '@shared/config/queryKeys';
import { onSleepEntryDeleted, onSleepEntrySaved } from '@shared/services/notifications.service';
import type { CreateSleepEntryDto } from '@shared/types/journal.types';
import { fromISOToDateString } from '@shared/utils/date';
import { logger } from '@shared/utils/logger';

export function useSleepEntries(date: string) {
  return useQuery({
    queryKey: queryKeys.journalSleep(date),
    queryFn: () => sleepApi.getSleepByDate(date),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertSleep() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (dto: CreateSleepEntryDto) => sleepApi.upsertSleep(dto),
    onSuccess: (data, variables) => {
      logger.info('[useUpsertSleep] Success:', data);
      trackMutation('sleep', 'create', true);

      const dateKey = fromISOToDateString(variables.date);
      queryClient.invalidateQueries({ queryKey: queryKeys.journalSleep(dateKey) });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalAllEntries() });

      onSleepEntrySaved(data).catch((err: unknown) =>
        logger.warn('[useUpsertSleep] notifications hook failed:', err),
      );

      toast.success(t('journal.sleep.saveSuccess'));
    },
    onError: (error) => {
      logger.error('[useUpsertSleep] Error:', error);
      trackMutation('sleep', 'create', false);
      toast.error(t('common.error'), t('journal.sleep.saveError'));
    },
  });
}

export function useDeleteSleep() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => sleepApi.deleteSleep(id),
    onSuccess: (_, variables) => {
      logger.info('[useDeleteSleep] Success');

      queryClient.invalidateQueries({ queryKey: queryKeys.journalSleep(variables.date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.journalAllEntries() });

      onSleepEntryDeleted(variables.date).catch((err: unknown) =>
        logger.warn('[useDeleteSleep] notifications hook failed:', err),
      );

      toast.success(t('journal.sleep.deleteSuccess'));
    },
    onError: (error) => {
      logger.error('[useDeleteSleep] Error:', error);
      toast.error(t('common.error'), t('journal.sleep.deleteError'));
    },
  });
}
