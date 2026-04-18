import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { authService } from '@features/auth/services/auth.service';
import type { ClientRow } from '@features/auth/services/auth.service';
import { routineService } from '@features/routine/services/routine.service';
import { queryKeys } from '@shared/config/queryKeys';
import { useAuthStore } from '@shared/stores/auth.store';
import { useUserStore } from '@shared/stores/user.store';
import type { UserProfile } from '@shared/types/user.types';
import { logger } from '@shared/utils/logger';
import { routineStorage } from '@shared/utils/routineStorage';

function mapClientToUserProfile(client: ClientRow): UserProfile {
  return {
    id: client.id,
    user_id: client.user_id,
    email: client.email ?? '',
    firstname: client.first_name ?? '',
    lastname: client.last_name ?? '',
    skinType: client.skin_type ?? undefined,
    birthday: client.birthday ?? undefined,
    avatar: client.avatar_url ?? null,
    hasRoutineAccess: client.has_routine_access,
  };
}

export function useInitializeUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setRoutineStatus = useUserStore((state) => state.setRoutineStatus);

  const {
    data,
    error,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      logger.info('[useInitializeUser] Fetching user from clients table');
      const client = await authService.getMe();
      return mapClientToUserProfile(client);
    },
    enabled: isAuthenticated && !isAuthLoading,
    retry: 1,
    staleTime: Infinity,
  });

  const hasRoutineAccess = useUserStore((state) => state.hasRoutineAccess);

  const { data: routineData, isLoading: isRoutineLoading } = useQuery({
    queryKey: queryKeys.routineLast(),
    queryFn: async () => {
      try {
        return await routineService.getLastRoutine();
      } catch (err) {
        logger.warn('[useInitializeUser] Routine fetch failed (expected during migration):', err);
        return null;
      }
    },
    enabled: isAuthenticated && !isAuthLoading && hasRoutineAccess,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      logger.info('[useInitializeUser] Setting user in store');
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      logger.warn('[useInitializeUser] Error fetching user, clearing:', error);
      clearUser();
    }
  }, [error, clearUser]);

  useEffect(() => {
    async function syncRoutineStatus(): Promise<void> {
      if (!isAuthenticated || !hasRoutineAccess || isRoutineLoading) return;
      if (!routineData) {
        setRoutineStatus('none');
        return;
      }
      const readyAt = await routineStorage.getReadyAt();
      if (readyAt && new Date() < readyAt) {
        setRoutineStatus('processing');
      } else {
        setRoutineStatus('ready');
        await routineStorage.clear();
      }
    }
    syncRoutineStatus();
  }, [routineData, isRoutineLoading, isAuthenticated, hasRoutineAccess, setRoutineStatus]);

  return {
    isLoading: isAuthLoading || isLoading || (hasRoutineAccess && isRoutineLoading),
    error,
    refetch: refetchUser,
  };
}
