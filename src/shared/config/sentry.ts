import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn as string | undefined

/**
 * Initialize Sentry for error tracking and monitoring
 * Only initializes if SENTRY_DSN is provided in environment
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    if (__DEV__) {
      console.warn('[Sentry] SENTRY_DSN not found - error tracking disabled')
    }
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
  })

  if (__DEV__) {
    console.log('[Sentry] Initialized successfully')
  }
}
