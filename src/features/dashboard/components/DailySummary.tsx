import { useState } from 'react'
import { LayoutAnimation, View } from 'react-native'

import { NutritionSummaryCard } from '@features/dashboard/components/NutritionSummaryCard'
import { SleepSummaryCard } from '@features/dashboard/components/SleepSummaryCard'
import { SportSummaryCard } from '@features/dashboard/components/SportSummaryCard'
import { appConfig } from '@shared/config/appConfig'
import type { MealEntry, SleepEntry, SportEntry } from '@shared/types/journal.types'
import { isPast } from '@shared/utils/date'

interface DailySummaryProps {
  sleepEntries: SleepEntry[]
  mealEntries: MealEntry[]
  sportEntries: SportEntry[]
  isLoading: boolean
  date: string
  onDeleteSleep?: (id: number) => void
  onDeleteMeal?: (id: number) => void
  onDeleteSport?: (id: number) => void
  onEditSleep?: (entry: SleepEntry) => void
  onEditMeal?: (entry: MealEntry) => void
  onEditSport?: (entry: SportEntry) => void
}

type CardType = 'sleep' | 'nutrition' | 'sport'

export function DailySummary({
  sleepEntries,
  mealEntries,
  sportEntries,
  isLoading,
  date,
  onDeleteSleep,
  onDeleteMeal,
  onDeleteSport,
  onEditSleep,
  onEditMeal,
  onEditSport,
}: DailySummaryProps) {
  const [expandedCard, setExpandedCard] = useState<CardType | null>(null)

  const canLogEntries = !isPast(date) || appConfig.features.allowPastEdits
  const isPastDate = isPast(date) && !appConfig.features.allowPastEdits

  const toggleCard = (card: CardType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedCard(expandedCard === card ? null : card)
  }

  const sleepEntry = Array.isArray(sleepEntries) ? sleepEntries[0] || null : null

  if (isLoading) {
    return (
      <View className="px-4 gap-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </View>
    )
  }

  return (
    <View className="px-4 gap-3">
      <SleepSummaryCard
        entry={sleepEntry}
        expanded={expandedCard === 'sleep'}
        onToggle={() => toggleCard('sleep')}
        canLogEntries={canLogEntries}
        isPastDate={isPastDate}
        onDelete={onDeleteSleep}
        onEdit={onEditSleep}
      />
      <NutritionSummaryCard
        entries={Array.isArray(mealEntries) ? mealEntries : []}
        expanded={expandedCard === 'nutrition'}
        onToggle={() => toggleCard('nutrition')}
        canLogEntries={canLogEntries}
        isPastDate={isPastDate}
        onDelete={onDeleteMeal}
        onEdit={onEditMeal}
      />
      <SportSummaryCard
        entries={Array.isArray(sportEntries) ? sportEntries : []}
        expanded={expandedCard === 'sport'}
        onToggle={() => toggleCard('sport')}
        canLogEntries={canLogEntries}
        isPastDate={isPastDate}
        onDelete={onDeleteSport}
        onEdit={onEditSport}
      />
    </View>
  )
}

function LoadingCard() {
  return (
    <View className="bg-surface rounded-2xl border border-border p-4">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 bg-border rounded-full" />
        <View className="flex-1">
          <View className="h-4 w-24 bg-border rounded mb-2" />
          <View className="h-3 w-32 bg-border rounded" />
        </View>
      </View>
    </View>
  )
}
