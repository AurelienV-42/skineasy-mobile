import { Plus } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Text, View } from 'react-native'

import assets from 'assets'

import { CircleProgress } from '@shared/components/CircleProgress'
import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface ScoreContainerProps {
  score: number // 0-100
  onPlusPress?: () => void
}

const SIZE = 200
const STROKE_WIDTH = 20

export function ScoreContainer({ score, onPlusPress }: ScoreContainerProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <View className="px-4">
      <ImageBackground
        source={assets.scoreSkin}
        className="rounded-2xl overflow-hidden pt-5"
        style={{ height: SIZE * 0.85 }}
        imageStyle={{ borderRadius: 16 }}
      >
        {/* Plus button */}
        {onPlusPress && (
          <Pressable
            onPress={onPlusPress}
            haptic="light"
            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-surface items-center justify-center"
          >
            <Plus size={20} color={colors.textMuted} strokeWidth={2} />
          </Pressable>
        )}

        {/* Score gauge */}
        <View className="items-center justify-center">
          <CircleProgress
            size={SIZE}
            strokeWidth={STROKE_WIDTH}
            progress={score}
            color={`${colors.surface}dd`}
            backgroundColor={`${colors.surface}40`}
            mode="semi"
          />
          {/* Score text centered in the arc */}
          <View className="absolute items-center" style={{ top: SIZE * 0.25 }}>
            <Text className="text-base font-medium text-surface opacity-80">
              {t('dashboard.score.label')}
            </Text>
            <Text className="text-5xl font-bold text-surface">{score}</Text>
            <Text className="-mt-2 text-base font-medium text-surface opacity-60">/ 100</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}
