import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import * as SplashScreen from 'expo-splash-screen'

import '../src/global.css'
import '../src/i18n'
import { queryClient } from '@shared/config/queryClient'
import { useAuthStore } from '@shared/stores/auth.store'
import { useInitializeUser } from '@features/auth/hooks/useInitializeUser'

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
    console.log('[_layout] Loading token...')
    loadToken()
  }, [loadToken])

  useEffect(() => {
    console.log('[_layout] State:', {
      fontsLoaded,
      isAuthLoading,
      isUserLoading,
      isAuthenticated,
    })
    if (fontsLoaded && !isAuthLoading && !isUserLoading) {
      console.log('[_layout] All ready, hiding splash screen')
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isAuthLoading, isUserLoading, isAuthenticated])

  console.log(
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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootLayoutContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
