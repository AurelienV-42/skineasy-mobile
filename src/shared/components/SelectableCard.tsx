import type { LucideIcon } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'

import { GlassContainer } from '@shared/components/GlassContainer'
import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

type SelectableCardProps = {
  selected: boolean
  onPress: () => void
  label: string
  icon?: LucideIcon
  haptic?: 'light' | 'medium' | 'heavy'
}

export function SelectableCard({
  selected,
  onPress,
  label,
  icon: Icon,
  haptic = 'light',
}: SelectableCardProps): React.ReactElement {
  const textColor = selected ? colors.primary : colors.textMuted

  const content = (
    <View className="flex-row items-center gap-3">
      {Icon && <Icon color={textColor} size={20} strokeWidth={2} />}
      <Text className={`font-semibold text-base ${selected ? 'text-primaryDark' : 'text-primary'}`}>
        {label}
      </Text>
    </View>
  )

  return (
    <Pressable onPress={onPress} haptic={haptic}>
      <GlassContainer style={selected ? styles.selected : styles.unselected}>
        {content}
      </GlassContainer>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  selected: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  unselected: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
  },
})
