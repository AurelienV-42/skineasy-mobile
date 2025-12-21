import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

export default function PasswordRecoveryScreen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="w-full px-4 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          haptic="light"
          className="w-10 h-10 items-center justify-center bg-surface rounded-full shadow-md"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
      </View>

      <WebView
        source={{ uri: 'https://skineasy.com/password-recovery' }}
        className="flex-1"
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      />
    </SafeAreaView>
  )
}
