import { ChevronRight, Clock } from 'lucide-react-native'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface ProcessingBannerProps {
  onPress: () => void
}

export function ProcessingBanner({ onPress }: ProcessingBannerProps) {
  const { t } = useTranslation()
  // eslint-disable-next-line react-hooks/refs
  const rotateAnim = useRef(new Animated.Value(0)).current
  // eslint-disable-next-line react-hooks/refs
  const pulseAnim = useRef(new Animated.Value(1)).current
  // eslint-disable-next-line react-hooks/refs
  const pressScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Rotating clock animation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    )
    rotate.start()

    // Pulse animation for the banner
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.01,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()

    return () => {
      rotate.stop()
      pulse.stop()
    }
    // eslint-disable-next-line react-hooks/refs
  }, [rotateAnim, pulseAnim])

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  // eslint-disable-next-line react-hooks/refs
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      haptic="medium"
    >
      <Animated.View
        style={{
          transform: [{ scale: Animated.multiply(pulseAnim, pressScale) }],
        }}
        className="bg-primary rounded-2xl p-5 shadow-lg overflow-hidden"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="mr-4">
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Clock size={32} color={colors.surface} strokeWidth={2} />
              </Animated.View>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white mb-1">{t('routine.processing')}</Text>
              <Text className="text-sm text-white/90">{t('routine.processingSubtitle')}</Text>
            </View>
          </View>
          <ChevronRight size={24} color={colors.surface} strokeWidth={2.5} />
        </View>
      </Animated.View>
    </Pressable>
  )
}
