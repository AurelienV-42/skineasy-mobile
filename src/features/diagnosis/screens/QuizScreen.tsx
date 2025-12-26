import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, Platform, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { WebView, WebViewNavigation } from 'react-native-webview'

import { Pressable } from '@shared/components/Pressable'
import { queryKeys } from '@shared/config/queryKeys'
import { useEntranceAnimation } from '@shared/hooks/useEntranceAnimation'
import { useUserStore } from '@shared/stores/user.store'
import { haptic } from '@shared/utils/haptic'
import { logger } from '@shared/utils/logger'
import { colors } from '@theme/colors'

const TYPEFORM_BASE_URL = 'https://form.typeform.com/to/XOEB81yk'

export default function QuizScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useUserStore((state) => state.user)
  const setHasDiagnosis = useUserStore((state) => state.setHasDiagnosis)
  const animStyles = useEntranceAnimation(2)

  const webViewRef = useRef<WebView>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  // Build Typeform URL with hidden fields
  const typeformUrl = `${TYPEFORM_BASE_URL}?email=${encodeURIComponent(user?.email || '')}&firstname=${encodeURIComponent(user?.firstname || '')}&lastname=${encodeURIComponent(user?.lastname || '')}`

  // Handle completion
  const handleCompletion = useCallback(() => {
    if (isCompleted) return
    setIsCompleted(true)
    haptic.success()

    // Invalidate diagnosis queries to refresh data
    queryClient.invalidateQueries({ queryKey: queryKeys.diagnosis })

    // Update user store
    setHasDiagnosis(true)

    // Show success toast
    Toast.show({
      type: 'success',
      text1: t('diagnosis.completeSuccess'),
    })

    // Navigate back after short delay
    setTimeout(() => {
      router.back()
    }, 1500)
  }, [isCompleted, queryClient, router, setHasDiagnosis, t])

  // Detect form completion via URL changes (Typeform shows ending screen)
  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const { url } = navState
      logger.info('[QuizScreen] Navigation:', url)

      // Typeform ending screens contain these patterns in the URL
      if (
        url.includes('/thankyou') ||
        url.includes('/thanks') ||
        url.includes('submitted=true') ||
        url.includes('/complete')
      ) {
        handleCompletion()
      }
    },
    [handleCompletion]
  )

  // Handle close button press with confirmation
  const handleClose = useCallback(() => {
    if (isCompleted) {
      router.back()
      return
    }

    // Show confirmation dialog
    Alert.alert(t('diagnosis.exitConfirmTitle'), t('diagnosis.exitConfirmMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('diagnosis.exitConfirm'),
        style: 'destructive',
        onPress: () => {
          haptic.medium()
          router.back()
        },
      },
    ])
  }, [isCompleted, router, t])

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header with close button */}
      <Animated.View
        style={animStyles[0]}
        className="flex-row items-center justify-end px-4 pt-2 pb-4"
      >
        <Pressable
          onPress={handleClose}
          haptic="light"
          className="h-10 w-10 items-center justify-center rounded-full bg-surface shadow-md"
          accessibilityLabel={t('common.close')}
        >
          <X size={24} color={colors.text} />
        </Pressable>
      </Animated.View>

      {/* WebView */}
      <Animated.View style={animStyles[1]} className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: typeformUrl }}
          className="flex-1"
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          onNavigationStateChange={handleNavigationStateChange}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-background">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  )
}
