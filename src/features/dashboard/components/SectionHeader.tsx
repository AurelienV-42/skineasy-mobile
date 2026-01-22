import type { LucideIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { colors } from '@theme/colors'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps): React.ReactElement {
  return (
    <View className="flex-row items-center gap-2 px-4 mb-5">
      <View
        className="p-2 rounded-md items-center justify-center border border-brown-dark/20"
        style={{ backgroundColor: colors.brownDark + '10' }}
      >
        <Icon size={16} color={colors.brownDark} strokeWidth={2.5} />
      </View>
      <Text className="text-xs text-brown-dark font-semibold" style={{ color: colors.text }}>
        {title}
      </Text>
    </View>
  )
}
