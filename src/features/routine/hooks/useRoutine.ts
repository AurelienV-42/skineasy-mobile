import { useQuery } from '@tanstack/react-query';

import type { RoutineDto } from '@features/routine/types/routine.types';
import { queryKeys } from '@shared/config/queryKeys';
import { useAuthStore } from '@shared/stores/auth.store';

export function useRoutine() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<RoutineDto | null, Error>({
    queryKey: queryKeys.routineLast(),
    queryFn: async (): Promise<RoutineDto | null> => {
      throw new Error('common.error');
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
