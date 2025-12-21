import { View, Text } from 'react-native'
import { ReactNode } from 'react'

import { Pressable } from '@shared/components/Pressable'

interface JournalCardProps {
  icon: ReactNode
  title: string
  onPress: () => void
  backgroundColor?: string
}

export function JournalCard({
  icon,
  title,
  onPress,
  backgroundColor = '#FFFFFF',
}: JournalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 aspect-square bg-surface rounded-2xl p-4 items-center justify-center border border-border"
      style={{ backgroundColor }}
      accessibilityLabel={title}
      accessibilityRole="button"
      haptic="medium"
    >
      <View className="items-center justify-center flex-1">
        {icon}
        <Text className="text-sm font-medium text-text text-center mt-3">{title}</Text>
      </View>
    </Pressable>
  )
}
