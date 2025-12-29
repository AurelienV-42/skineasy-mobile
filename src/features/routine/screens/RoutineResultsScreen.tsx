import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { RoutineEmptyState } from '@features/routine/components/RoutineEmptyState'
import { RoutineErrorState } from '@features/routine/components/RoutineErrorState'
import { RoutineLoadingState } from '@features/routine/components/RoutineLoadingState'
import { RoutineStepCard } from '@features/routine/components/RoutineStepCard'
import { RoutineSummaryCard } from '@features/routine/components/RoutineSummaryCard'
import { RoutineToggle } from '@features/routine/components/RoutineToggle'
import { useRoutine } from '@features/routine/hooks/useRoutine'
import { useTodayRoutine } from '@features/routine/hooks/useTodayRoutine'
import type { TimeOfDay } from '@features/routine/types/routine.types'
import { ScreenHeader } from '@shared/components/ScreenHeader'

/**
 * Main Routine Results Screen
 *
 * Displays the authenticated user's skincare routine with:
 * - Morning/Evening toggle
 * - Step-by-step product cards with instructions
 * - Shop buttons for each product
 */
export default function RoutineResultsScreen() {
  const { t } = useTranslation()
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('morning')

  const { data: routine, isLoading, isError } = useRoutine()
  const todayRoutine = useTodayRoutine(routine)

  // Loading state
  if (isLoading) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <RoutineLoadingState />
      </ScreenHeader>
    )
  }

  // Error state
  if (isError) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <RoutineErrorState />
      </ScreenHeader>
    )
  }

  // No routine found
  if (!routine || !todayRoutine) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <RoutineEmptyState />
      </ScreenHeader>
    )
  }

  const currentSteps =
    selectedTime === 'morning' ? todayRoutine.morning.steps : todayRoutine.evening.steps

  return (
    <ScreenHeader edges={['top']} title={t('routine.resultsTitle')} noScroll>
      {/* Skin Profile Summary */}
      <RoutineSummaryCard
        summary={routine.summary}
        analysis={routine.analysis}
        productSelection={routine.productSelection}
      />

      {/* Morning/Evening Toggle */}
      <RoutineToggle
        selected={selectedTime}
        onSelect={setSelectedTime}
        morningStepCount={todayRoutine.morning.steps.length}
        eveningStepCount={todayRoutine.evening.steps.length}
      />

      {/* Scrollable Step Cards */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-2 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Day Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-4">
          <Text className="text-lg font-semibold text-text">{todayRoutine.dayName}</Text>
          <Text className="text-sm text-textMuted">
            {selectedTime === 'morning'
              ? `~${todayRoutine.morning.estimatedMinutes} min`
              : `~${todayRoutine.evening.estimatedMinutes} min`}
          </Text>
        </Animated.View>

        {/* Step Cards */}
        {currentSteps.map((stepWithProducts, index) => (
          <RoutineStepCard
            key={`${stepWithProducts.step.category}-${stepWithProducts.step.order}`}
            stepWithProducts={stepWithProducts}
            index={index}
          />
        ))}

        {/* Empty state for current time */}
        {currentSteps.length === 0 && (
          <View className="items-center py-8">
            <Text className="text-textMuted">{t('routine.noProducts')}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenHeader>
  )
}
