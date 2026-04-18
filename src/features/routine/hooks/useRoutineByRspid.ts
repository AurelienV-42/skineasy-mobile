import { useQuery } from '@tanstack/react-query';

import type { RoutineResponse } from '@shared/types/routine.types';
import { queryKeys } from '@shared/config/queryKeys';

export function useRoutineByRspid(rspid: string | null) {
  return useQuery<RoutineResponse, Error>({
    queryKey: queryKeys.routineByRspid(rspid || ''),
    queryFn: async (): Promise<RoutineResponse> => {
      if (!rspid) {
        throw new Error('No rspid provided');
      }

      throw new Error('common.error');
    },
    enabled: !!rspid,
    staleTime: 30 * 1000,
  });
}
