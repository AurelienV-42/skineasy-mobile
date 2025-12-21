import { View, Text } from 'react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Sun, Moon } from 'lucide-react-native'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

export default function RoutineScreen() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning')

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-text mb-6">{t('routine.title')}</Text>

        {/* Toggle */}
        <View className="flex-row bg-surface rounded-md p-1 mb-6">
          <Pressable
            onPress={() => setActiveTab('morning')}
            haptic="medium"
            className={`flex-1 flex-row items-center justify-center py-3 rounded-md gap-2 ${
              activeTab === 'morning' ? 'bg-primary' : ''
            }`}
          >
            <Sun size={18} color={activeTab === 'morning' ? colors.surface : colors.textMuted} />
            <Text
              className={`text-sm font-medium ${
                activeTab === 'morning' ? 'text-white' : 'text-text-muted'
              }`}
            >
              {t('routine.morning')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('evening')}
            haptic="medium"
            className={`flex-1 flex-row items-center justify-center py-3 rounded-md gap-2 ${
              activeTab === 'evening' ? 'bg-primary' : ''
            }`}
          >
            <Moon size={18} color={activeTab === 'evening' ? colors.surface : colors.textMuted} />
            <Text
              className={`text-sm font-medium ${
                activeTab === 'evening' ? 'text-white' : 'text-text-muted'
              }`}
            >
              {t('routine.evening')}
            </Text>
          </Pressable>
        </View>

        {/* Placeholder - Products will be added in Phase 7 */}
        <View className="bg-surface rounded-md p-4 border border-border">
          <Text className="text-base font-medium text-text">
            {t('routine.step', { number: 1 })}: {t('routine.cleanse')}
          </Text>
          <Text className="text-sm text-text-muted mt-2">{t('routine.productPlaceholder')}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
