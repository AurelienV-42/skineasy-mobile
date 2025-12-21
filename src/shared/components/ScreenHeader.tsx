import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface ScreenHeaderProps {
  title: string
  children: ReactNode
}

// Context to provide scroll functionality to child components
interface ScrollContextType {
  scrollToPosition: (y: number) => void
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export const useScrollContext = () => {
  const context = useContext(ScrollContext)
  return context
}

export function ScreenHeader({ title, children }: ScreenHeaderProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)

  const scrollToPosition = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y,
      animated: true,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={t('common.back')}
          haptic="light"
        >
          <ChevronLeft size={28} color={colors.text} />
        </Pressable>
        <Text className="text-3xl font-bold text-primary">{title}</Text>
        <View className="w-7" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollContext.Provider value={{ scrollToPosition }}>
          <ScrollView ref={scrollViewRef} className="flex-1" keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-4 pb-8">{children}</View>
          </ScrollView>
        </ScrollContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// Keep JournalLayout as an alias for backward compatibility
export { ScreenHeader as JournalLayout }
