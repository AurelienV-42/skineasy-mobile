import { ChevronRight, type LucideIcon } from 'lucide-react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { Card } from '@shared/components/Card'
import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

type IndicatorStatus = 'empty' | 'partial' | 'complete'

interface IndicatorCardProps {
  icon: LucideIcon
  label: string
  value: string
  onPress?: () => void
  disabled?: boolean
  status: IndicatorStatus
}

const STATUS_COLORS: Record<IndicatorStatus, string> = {
  empty: colors.textMuted,
  partial: colors.warning,
  complete: colors.success,
}

function StatusDot({ status }: { status: IndicatorStatus }): React.ReactElement {
  const scale = useSharedValue(1)

  useEffect(() => {
    if (status === 'empty' || status === 'partial') {
      scale.value = withRepeat(
        withSequence(withTiming(1.3, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1
      )
    } else {
      scale.value = 1
    }
  }, [status, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      style={[
        { width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_COLORS[status] },
        animatedStyle,
      ]}
    />
  )
}

export function IndicatorCard({
  icon: Icon,
  label,
  value,
  onPress,
  disabled = false,
  status,
}: IndicatorCardProps): React.ReactElement {
  const { t } = useTranslation()
  const isEmpty = status === 'empty'

  const content = (
    <Card padding="sm" className="gap-5">
      {/* Top row: Icon + Label + Status Dot */}
      <View className="flex-row justify-between items-center pr-1">
        <View className="flex-row items-center gap-1.5">
          <Icon size={20} color={colors.brownDark} />
          <Text className="font-semibold text-brown-dark">{label}</Text>
        </View>
        <StatusDot status={status} />
      </View>

      {/* Bottom row: Value or Empty state */}
      <View className="flex-row justify-between items-end">
        {isEmpty ? (
          <>
            <Text className="text-base text-text-muted">{t('dashboard.indicators.enterData')}</Text>
            <ChevronRight size={20} color={colors.textMuted} />
          </>
        ) : (
          <>
            <View className="flex-1" />
            <Text className="text-2xl font-bold text-text">{value}</Text>
          </>
        )}
      </View>
    </Card>
  )

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress} haptic="light">
        {content}
      </Pressable>
    )
  }

  return content
}
