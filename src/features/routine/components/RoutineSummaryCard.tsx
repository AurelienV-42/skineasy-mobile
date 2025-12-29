import { Baby, Clock, Droplets, Package } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import type { RoutineSummaryDto, SkinAnalysisDto } from '@features/routine/types/routine.types'
import { colors } from '@theme/colors'

interface StatItemProps {
  icon: React.ReactNode
  value: string
}

function StatItem({ icon, value }: StatItemProps) {
  return (
    <View className="flex-row items-center">
      {icon}
      <Text className="text-sm text-textMuted ml-1">{value}</Text>
    </View>
  )
}

interface RoutineSummaryCardProps {
  summary: RoutineSummaryDto
  analysis: SkinAnalysisDto
}

export function RoutineSummaryCard({ summary, analysis }: RoutineSummaryCardProps) {
  const { t } = useTranslation()

  const concerns = summary.primaryConcerns.join(' · ')
  const isPregnancySafe = analysis.healthConditions.isPregnancySafe

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className="bg-primary/5 rounded-2xl p-4 mb-4 border border-primary/20"
    >
      {/* Skin Type Header */}
      <View className="flex-row items-center mb-2">
        <View className="bg-primary/10 rounded-full p-2 mr-3">
          <Droplets size={20} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-text">{summary.skinTypeLabel}</Text>
          {concerns && <Text className="text-sm text-textMuted">{concerns}</Text>}
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row items-center justify-start gap-4 mt-3 pt-3 border-t border-primary/10">
        <StatItem
          icon={<Package size={16} color={colors.textMuted} />}
          value={t('routine.summary.products', { count: summary.totalProducts })}
        />
        <StatItem
          icon={<Clock size={16} color={colors.textMuted} />}
          value={t('routine.summary.dailyTime', { minutes: summary.averageDailyMinutes })}
        />
        {isPregnancySafe && (
          <View className="flex-row items-center bg-success/10 rounded-full px-2 py-1">
            <Baby size={14} color={colors.success} />
            <Text className="text-xs text-success font-medium ml-1">
              {t('routine.summary.pregnancySafe')}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  )
}
