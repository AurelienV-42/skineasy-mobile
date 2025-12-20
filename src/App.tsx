import { useCallback } from 'react'
import { View } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong',
        })
      },
    },
  },
})

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

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
