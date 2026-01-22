import type { LucideIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { colors } from '@theme/colors'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps): React.ReactElement {
  return (
    <View className="flex-row items-center gap-2 px-4 mb-3">
      <View
        className="w-7 h-7 rounded-lg items-center justify-center"
        style={{ backgroundColor: colors.primary + '15' }}
      >
        <Icon size={16} color={colors.primary} strokeWidth={2.5} />
      </View>
      <Text className="text-base font-semibold" style={{ color: colors.text }}>
        {title}
      </Text>
    </View>
  )
}
