import { useEffect, useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { ChevronRight, Sparkles } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface QuizBannerProps {
  onPress: () => void
}

export function QuizBanner({ onPress }: QuizBannerProps) {
  const { t } = useTranslation()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pressScale = useRef(new Animated.Value(1)).current
  const float1 = useRef(new Animated.Value(0)).current
  const float2 = useRef(new Animated.Value(0)).current
  const float3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Smaller, gentler pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.015, // Much smaller pulse (1.5% instead of 3%)
          duration: 2000, // Slower
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()

    // Floating particles animations
    const createFloat = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      )
    }

    const float1Anim = createFloat(float1, 0)
    const float2Anim = createFloat(float2, 500)
    const float3Anim = createFloat(float3, 1000)

    float1Anim.start()
    float2Anim.start()
    float3Anim.start()

    return () => {
      pulse.stop()
      float1Anim.stop()
      float2Anim.stop()
      float3Anim.stop()
    }
  }, [scaleAnim, float1, float2, float3])

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

  const getFloatStyle = (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -12],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 1, 0.2],
    }),
  })

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={{
          transform: [{ scale: Animated.multiply(scaleAnim, pressScale) }],
        }}
        className="bg-secondary rounded-2xl p-5 shadow-lg overflow-hidden"
      >
        {/* Floating particles */}
        <Animated.View
          style={[
            { position: 'absolute', top: 12, right: 35, width: 6, height: 6, borderRadius: 3 },
            getFloatStyle(float1),
          ]}
          className="bg-white"
        />
        <Animated.View
          style={[
            { position: 'absolute', top: 28, right: 65, width: 4, height: 4, borderRadius: 2 },
            getFloatStyle(float2),
          ]}
          className="bg-white"
        />
        <Animated.View
          style={[
            { position: 'absolute', top: 45, right: 50, width: 5, height: 5, borderRadius: 2.5 },
            getFloatStyle(float3),
          ]}
          className="bg-white"
        />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="mr-4">
              <Sparkles size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white mb-1">
                {t('dashboard.quiz.title')}
              </Text>
              <Text className="text-sm text-white/90">{t('dashboard.quiz.subtitle')}</Text>
            </View>
          </View>
          <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </Animated.View>
    </Pressable>
  )
}
