import { Plus } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface ScoreContainerProps {
  score: number // 0-100
  onPlusPress?: () => void
}

export function ScoreContainer({ score, onPlusPress }: ScoreContainerProps): React.ReactElement {
  const { t } = useTranslation()

  // Circle dimensions
  const size = 100
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score, 0), 100) / 100
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <View className="px-4 py-2">
      <View className="bg-primary rounded-xl p-4 items-center relative">
        {/* Plus button */}
        {onPlusPress && (
          <Pressable
            onPress={onPlusPress}
            haptic="light"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/20 items-center justify-center"
          >
            <Plus size={16} color={colors.surface} strokeWidth={3} />
          </Pressable>
        )}

        {/* Score circle */}
        <View className="relative items-center justify-center">
          <Svg width={size} height={size}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`${colors.surface}30`}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.surface}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View className="absolute items-center">
            <Text className="text-sm font-medium text-surface opacity-80">
              {t('dashboard.score.label')}
            </Text>
            <Text className="text-4xl font-bold text-surface">{score}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
