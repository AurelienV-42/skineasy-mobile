import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { Edge, SafeAreaView } from 'react-native-safe-area-context'

import { Pressable } from '@shared/components/Pressable'
import { useEntranceAnimation } from '@shared/hooks/useEntranceAnimation'
import { colors } from '@theme/colors'

interface ScreenHeaderProps {
  title: string
  children: ReactNode
  /** When true, children are rendered without ScrollView wrapper (for screens with custom scroll) */
  noScroll?: boolean
  edges?: Edge[]
  /** When false, hides the back button (default: true) */
  canGoBack?: boolean
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

export function ScreenHeader({
  title,
  children,
  noScroll = false,
  edges = ['top', 'bottom'],
  canGoBack = true,
}: ScreenHeaderProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const animStyles = useEntranceAnimation(2)

  const scrollToPosition = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y,
      animated: true,
    })
  }

  const content = (
    <Animated.View style={animStyles[1]} className="flex-1 px-4 pt-4">
      {children}
    </Animated.View>
  )

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background">
      {/* Custom Header */}
      <Animated.View
        style={animStyles[0]}
        className="flex-row items-center justify-between px-4 pt-2 pb-4"
      >
        {canGoBack ? (
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel={t('common.back')}
            haptic="light"
          >
            <ArrowLeft size={28} color={colors.text} />
          </Pressable>
        ) : (
          <View className="w-7" />
        )}
        <Text className="text-3xl font-bold text-primary">{title}</Text>
        <View className="w-7" />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollContext.Provider value={{ scrollToPosition }}>
          {noScroll ? (
            content
          ) : (
            <ScrollView ref={scrollViewRef} className="flex-1" keyboardShouldPersistTaps="handled">
              {content}
            </ScrollView>
          )}
        </ScrollContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
