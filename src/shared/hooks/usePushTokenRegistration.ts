import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import { registerToken } from '@shared/data/push-tokens.api';
import { logger } from '@shared/utils/logger';

const MIN_REGISTER_INTERVAL_MS = 60_000;

async function registerPushToken(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  await registerToken(token, platform);
  logger.info('[usePushTokenRegistration] Token registered');
}

export function usePushTokenRegistration(isAuthenticated: boolean): void {
  const appState = useRef(AppState.currentState);
  const lastAttemptAt = useRef(0);
  const inFlight = useRef(false);
  const hasFailed = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const tryRegister = (source: 'mount' | 'foreground'): void => {
      if (inFlight.current) return;
      if (hasFailed.current) return;
      const now = Date.now();
      if (now - lastAttemptAt.current < MIN_REGISTER_INTERVAL_MS) return;
      lastAttemptAt.current = now;
      inFlight.current = true;
      registerPushToken()
        .catch((err: unknown) => {
          hasFailed.current = true;
          const label =
            source === 'mount' ? 'Failed to register token' : 'Foreground re-register failed';
          logger.warn(`[usePushTokenRegistration] ${label}:`, err);
        })
        .finally(() => {
          inFlight.current = false;
        });
    };

    tryRegister('mount');

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current !== 'active' && nextState === 'active' && isAuthenticated) {
        tryRegister('foreground');
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [isAuthenticated]);
}
