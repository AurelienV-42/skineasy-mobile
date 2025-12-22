import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useInitializeUser } from '@features/auth/hooks/useInitializeUser'
import * as Sentry from '@sentry/react-native'
import { queryClient } from '@shared/config/queryClient'
import { initSentry } from '@shared/config/sentry'
import { useAuthStore } from '@shared/stores/auth.store'
import { logger } from '@shared/utils/logger'
import '../src/global.css'
import '../src/i18n'

// Initialize Sentry before app starts
initSentry()

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

function RootLayoutContent() {
  const insets = useSafeAreaInsets()
  const loadToken = useAuthStore((state) => state.loadToken)
  const isAuthLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  // Initialize user data from /me endpoint
  const { isLoading: isUserLoading } = useInitializeUser()

  useEffect(() => {
    logger.info('[_layout] Loading token...')
    loadToken()
  }, [loadToken])

  useEffect(() => {
    logger.info('[_layout] State:', {
      fontsLoaded,
      isAuthLoading,
      isUserLoading,
      isAuthenticated,
    })
    if (fontsLoaded && !isAuthLoading && !isUserLoading) {
      logger.info('[_layout] All ready, hiding splash screen')
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isAuthLoading, isUserLoading, isAuthenticated])

  logger.info(
    '[_layout] Render check - showing splash?',
    !fontsLoaded || isAuthLoading || isUserLoading
  )

  if (!fontsLoaded || isAuthLoading || isUserLoading) {
    return null
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast topOffset={insets.top + 8} />
    </>
  )
}

export default Sentry.wrap(function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <RootLayoutContent />
          </SafeAreaProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
})
