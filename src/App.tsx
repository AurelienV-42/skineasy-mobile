import { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import * as SplashScreen from 'expo-splash-screen'

import '@/global.css'
import '@i18n/index'
import { queryClient } from '@shared/config'
import { useAuthStore } from '@shared/stores'

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

export default function App() {
  const loadToken = useAuthStore((state) => state.loadToken)

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  useEffect(() => {
    loadToken()
  }, [loadToken])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View className="flex-1 bg-background" onLayout={onLayoutRootView}>
          <View className="flex-1 items-center justify-center">
            {/* RootNavigator will go here */}
          </View>
        </View>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
