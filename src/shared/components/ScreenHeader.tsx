import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

interface ScreenHeaderProps {
  title: string
  children: ReactNode
}

export function ScreenHeader({ title, children }: ScreenHeaderProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <Pressable onPress={() => router.back()} accessibilityLabel={t('common.back')}>
          <ChevronLeft size={28} color={colors.text} />
        </Pressable>
        <Text className="text-3xl font-bold text-primary">{title}</Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1">
        <View className="flex-1 px-4 pb-8">{children}</View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Keep JournalLayout as an alias for backward compatibility
export { ScreenHeader as JournalLayout }
