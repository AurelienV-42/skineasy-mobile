import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Wifi, WifiOff } from 'lucide-react-native'

import { useNetworkStore } from '@shared/stores/network.store'
import { colors } from '@theme/colors'

const BANNER_HEIGHT = 44
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.8,
}

type BannerState = 'hidden' | 'offline' | 'back-online'

/**
 * Premium offline banner that slides down from the top when connectivity is lost.
 * Auto-hides with a brief "Back online" message when connection is restored.
 */
export function OfflineBanner() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const isConnected = useNetworkStore((state) => state.isConnected)
  const isInternetReachable = useNetworkStore((state) => state.isInternetReachable)

  // Consider offline if not connected OR if internet is explicitly not reachable
  // (isInternetReachable === null means "unknown", so we don't treat that as offline)
  const isOnline = isConnected && isInternetReachable !== false

  const [bannerState, setBannerState] = useState<BannerState>('hidden')
  const isFirstRender = useRef(true)
  const previousOnline = useRef<boolean | null>(null)
  const progress = useSharedValue(0)

  // Handle connectivity changes
  useEffect(() => {
    // Skip animation on first render - just set initial state if offline
    if (isFirstRender.current) {
      isFirstRender.current = false
      previousOnline.current = isOnline
      if (!isOnline) {
        setBannerState('offline')
        progress.value = 1
      }
      return
    }

    // Only react to actual changes
    if (previousOnline.current === isOnline) {
      return
    }
    previousOnline.current = isOnline

    if (!isOnline) {
      // Going offline - show banner
      setBannerState('offline')
      progress.value = withSpring(1, SPRING_CONFIG)
    } else if (bannerState === 'offline') {
      // Coming back online - show success state briefly
      setBannerState('back-online')

      // Hide after delay
      progress.value = withDelay(
        1500,
        withSpring(0, SPRING_CONFIG, (finished) => {
          if (finished) {
            runOnJS(setBannerState)('hidden')
          }
        })
      )
    }
  }, [isOnline, bannerState])

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-(BANNER_HEIGHT + insets.top), 0])

    return {
      transform: [{ translateY }],
      opacity: progress.value,
    }
  })

  // Don't render if hidden
  if (bannerState === 'hidden') {
    return null
  }

  const isBackOnline = bannerState === 'back-online'
  const backgroundColor = isBackOnline ? colors.success : colors.error
  const Icon = isBackOnline ? Wifi : WifiOff
  const message = isBackOnline ? t('common.backOnline') : t('common.offline')

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: insets.top,
          height: BANNER_HEIGHT + insets.top,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        },
        animatedStyle,
      ]}
    >
      <Icon size={18} color="#FFFFFF" strokeWidth={2.5} />
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{message}</Text>
    </Animated.View>
  )
}
