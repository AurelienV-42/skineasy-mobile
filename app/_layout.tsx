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

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

function RootLayoutContent() {
  const insets = useSafeAreaInsets()
  const loadToken = useAuthStore((state) => state.loadToken)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  useEffect(() => {
    loadToken()
  }, [loadToken])

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isLoading])

  if (!fontsLoaded || isLoading) {
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
