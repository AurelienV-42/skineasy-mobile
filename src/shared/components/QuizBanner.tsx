import { ChevronRight, Sparkles } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Animated, Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import { useBannerAnimation } from '@shared/hooks/useBannerAnimation'

interface QuizBannerProps {
  onPress: () => void
}

export function QuizBanner({ onPress }: QuizBannerProps) {
  const { t } = useTranslation()
  const { scaleAnim, pressScale, floatAnims, handlePressIn, handlePressOut, getFloatStyle } =
    useBannerAnimation()

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      haptic="medium"
    >
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
            getFloatStyle(floatAnims[0]),
          ]}
          className="bg-white"
        />
        <Animated.View
          style={[
            { position: 'absolute', top: 28, right: 65, width: 4, height: 4, borderRadius: 2 },
            getFloatStyle(floatAnims[1]),
          ]}
          className="bg-white"
        />
        <Animated.View
          style={[
            { position: 'absolute', top: 45, right: 50, width: 5, height: 5, borderRadius: 2.5 },
            getFloatStyle(floatAnims[2]),
          ]}
          className="bg-white"
        />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="mr-4">
              <Sparkles size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white mb-1">{t('dashboard.quiz.title')}</Text>
              <Text className="text-sm text-white/90">{t('dashboard.quiz.subtitle')}</Text>
            </View>
          </View>
          <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </Animated.View>
    </Pressable>
  )
}
