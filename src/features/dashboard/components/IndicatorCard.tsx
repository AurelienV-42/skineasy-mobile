import type { LucideIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

type VisualType = 'bars' | 'progress' | 'stars' | 'segments'

interface IndicatorCardProps {
  icon: LucideIcon
  label: string
  value: string
  visualType: VisualType
  visualData?: number[] | number
  onPress?: () => void
  disabled?: boolean
}

export function IndicatorCard({
  icon: Icon,
  label,
  value,
  visualType,
  visualData,
  onPress,
  disabled = false,
}: IndicatorCardProps): React.ReactElement {
  const content = (
    <View className="flex-1 p-3 gap-4 bg-surface rounded-xl shadow-sm">
      {/* Top row: Icon + Label + Dots */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-1.5">
          <Icon size={20} color={colors.textMuted} />
          <Text className="text-sm font-semibold text-text-muted">{label}</Text>
        </View>
        <View className="flex-row items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i < 3 ? colors.primary : colors.border }}
            />
          ))}
        </View>
      </View>

      {/* Bottom row: Value + Visual */}
      <View className="flex-row justify-between items-end">
        <Text className="text-lg font-bold text-text">{value}</Text>
        <View className="flex-1 items-end ml-2">{renderVisual(visualType, visualData)}</View>
      </View>
    </View>
  )

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress} haptic="light" className="flex-1">
        {content}
      </Pressable>
    )
  }

  return <View className="flex-1">{content}</View>
}

function renderVisual(type: VisualType, data?: number[] | number): React.ReactElement {
  switch (type) {
    case 'bars':
      return <BarChart data={data as number[] | undefined} />
    case 'progress':
      return <ProgressBar value={data as number | undefined} />
    case 'stars':
      return <StarRating value={data as number | undefined} />
    case 'segments':
      return <SegmentBar data={data as number[] | undefined} />
    default:
      return <View />
  }
}

function BarChart({ data = [1, 2, 3, 4, 5] }: { data?: number[] }): React.ReactElement {
  const maxHeight = 40
  const maxValue = Math.max(...data, 1)

  return (
    <View className="flex-row items-end gap-1" style={{ height: maxHeight }}>
      {data.map((val, i) => (
        <View
          key={i}
          className="w-2 rounded"
          style={{
            height: (val / maxValue) * maxHeight,
            backgroundColor: i === data.length - 1 ? colors.primary : `${colors.text}20`,
          }}
        />
      ))}
    </View>
  )
}

function ProgressBar({ value = 0 }: { value?: number }): React.ReactElement {
  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <View className="w-20">
      <View className="h-2 bg-text/10 rounded overflow-hidden">
        <View className="h-full bg-primary rounded" style={{ width: `${percentage}%` }} />
      </View>
    </View>
  )
}

function StarRating({ value = 0 }: { value?: number }): React.ReactElement {
  const stars = Math.min(Math.max(Math.round(value), 0), 5)

  return (
    <View className="flex-row gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: i < stars ? colors.warning : `${colors.text}20` }}
        />
      ))}
    </View>
  )
}

function SegmentBar({ data = [30, 20, 30, 20] }: { data?: number[] }): React.ReactElement {
  const segmentColors = [colors.error, colors.primary, `${colors.text}40`, `${colors.text}20`]

  return (
    <View className="flex-row h-2 rounded overflow-hidden w-20">
      {data.map((width, i) => (
        <View
          key={i}
          className="h-full"
          style={{
            flex: width,
            backgroundColor: segmentColors[i % segmentColors.length],
          }}
        />
      ))}
    </View>
  )
}
