import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@features/auth/services/auth.service';
import { queryKeys } from '@shared/config/queryKeys';
import { logger } from '@shared/utils/logger';

interface DevLoginInput {
  email: string;
  devSecret: string;
}

export function useDevLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DevLoginInput): Promise<void> => {
      logger.info('[useDevLogin] Attempting dev login:', { email: data.email });
      await authService.login({ email: data.email, password: data.devSecret });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}
