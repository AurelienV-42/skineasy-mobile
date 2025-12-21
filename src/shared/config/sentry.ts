import * as Sentry from '@sentry/react-native'
import { logger } from '@shared/utils/logger'
import Constants from 'expo-constants'

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn as string | undefined

/**
 * Initialize Sentry for error tracking and monitoring
 * Only initializes if SENTRY_DSN is provided in environment
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    if (__DEV__) {
      logger.warn('[Sentry] SENTRY_DSN not found - error tracking disabled')
    }
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    enabled: !__DEV__,
  })

  if (__DEV__) {
    logger.info('[Sentry] Initialized successfully')
  }
}
