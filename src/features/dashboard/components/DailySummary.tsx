/**
 * Daily Summary Component
 *
 * Expandable cards showing journal entries for a specific date:
 * - Sleep: Hours + quality with icon
 * - Nutrition: Meal count with photo preview
 * - Sport: Activity count with total duration
 *
 * Premium features:
 * - Smooth expand/collapse animations
 * - Haptic feedback on interactions
 * - Empty states with gentle CTAs
 * - Loading states
 */

import { useState } from 'react'
import { View, Text, Image, LayoutAnimation, Platform, UIManager } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Moon, Utensils, Activity, ChevronDown, Plus, Frown, Meh, Smile } from 'lucide-react-native'

import { Pressable } from '@shared/components/Pressable'
import type { SleepEntry, MealEntry, SportEntry } from '@shared/types/journal.types'
import { colors } from '@theme/colors'
import { getSportTypeLabel } from '@features/journal/utils/sportMapping'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface DailySummaryProps {
  sleepEntries: SleepEntry[]
  mealEntries: MealEntry[]
  sportEntries: SportEntry[]
  isLoading: boolean
  date: string
}

export function DailySummary({
  sleepEntries,
  mealEntries,
  sportEntries,
  isLoading,
}: DailySummaryProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const [expandedCard, setExpandedCard] = useState<'sleep' | 'nutrition' | 'sport' | null>(null)

  const toggleCard = (card: 'sleep' | 'nutrition' | 'sport') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedCard(expandedCard === card ? null : card)
  }

  // Sleep data
  const sleepEntry = Array.isArray(sleepEntries) ? sleepEntries[0] || null : null
  const SleepQualityIcon =
    sleepEntry?.quality === 1 || sleepEntry?.quality === 2
      ? Frown
      : sleepEntry?.quality === 3
        ? Meh
        : Smile

  // Nutrition data
  const mealCount = Array.isArray(mealEntries) ? mealEntries.length : 0

  // Sport data
  const sportCount = Array.isArray(sportEntries) ? sportEntries.length : 0
  const totalDuration = Array.isArray(sportEntries)
    ? sportEntries.reduce((sum, entry) => sum + entry.duration, 0)
    : 0

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
      {/* Sleep Card */}
      <Pressable
        onPress={() => toggleCard('sleep')}
        haptic="light"
        className="bg-surface rounded-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Moon size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="text-base font-medium text-text">{t('journal.sleep.title')}</Text>
              {sleepEntry ? (
                <Text className="text-sm text-textMuted">
                  {sleepEntry.hours}h · {getSleepQualityLabel(sleepEntry.quality, t)}
                </Text>
              ) : (
                <Text className="text-sm text-textMuted">{t('dashboard.summary.notLogged')}</Text>
              )}
            </View>
          </View>
          <ChevronDown
            size={20}
            color={colors.textMuted}
            style={{
              transform: [{ rotate: expandedCard === 'sleep' ? '180deg' : '0deg' }],
            }}
          />
        </View>

        {/* Expanded Content */}
        {expandedCard === 'sleep' && (
          <View className="px-4 pb-4 border-t border-border pt-4">
            {sleepEntry ? (
              <View className="flex-row items-center gap-4">
                <View className="items-center">
                  <SleepQualityIcon size={40} color={colors.primary} strokeWidth={2} />
                  <Text className="text-xs text-textMuted mt-1">
                    {getSleepQualityLabel(sleepEntry.quality, t)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-text">{sleepEntry.hours}h</Text>
                  <Text className="text-sm text-textMuted">{t('journal.sleep.hours')}</Text>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push('/journal/sleep')}
                haptic="light"
                className="bg-primary/5 rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-sm text-primary font-medium">
                  {t('dashboard.summary.logSleep')}
                </Text>
                <Plus size={20} color={colors.primary} />
              </Pressable>
            )}
          </View>
        )}
      </Pressable>

      {/* Nutrition Card */}
      <Pressable
        onPress={() => toggleCard('nutrition')}
        haptic="light"
        className="bg-surface rounded-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
              <Utensils size={20} color={colors.secondary} />
            </View>
            <View>
              <Text className="text-base font-medium text-text">
                {t('journal.nutrition.title')}
              </Text>
              {mealCount > 0 ? (
                <Text className="text-sm text-textMuted">
                  {mealCount}{' '}
                  {mealCount === 1 ? t('dashboard.summary.meal') : t('dashboard.summary.meals')}
                </Text>
              ) : (
                <Text className="text-sm text-textMuted">{t('dashboard.summary.notLogged')}</Text>
              )}
            </View>
          </View>
          <ChevronDown
            size={20}
            color={colors.textMuted}
            style={{
              transform: [{ rotate: expandedCard === 'nutrition' ? '180deg' : '0deg' }],
            }}
          />
        </View>

        {/* Expanded Content */}
        {expandedCard === 'nutrition' && (
          <View className="px-4 pb-4 border-t border-border pt-4">
            {mealCount > 0 && Array.isArray(mealEntries) ? (
              <View className="gap-3">
                {mealEntries.map((meal) => (
                  <View key={meal.id} className="flex-row gap-3">
                    {meal.photo_url && (
                      <Image
                        source={{ uri: meal.photo_url }}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="cover"
                      />
                    )}
                    <View className="flex-1 justify-center">
                      {meal.meal_type && (
                        <Text className="text-xs font-medium text-primary uppercase">
                          {t(`dashboard.summary.mealType.${meal.meal_type}`)}
                        </Text>
                      )}
                      {meal.note && (
                        <Text className="text-sm text-textMuted mt-1" numberOfLines={2}>
                          {meal.note}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
                {/* Add More Button */}
                <Pressable
                  onPress={() => router.push('/journal/nutrition')}
                  haptic="light"
                  className="bg-secondary/10 rounded-xl p-3 flex-row items-center justify-center mt-2"
                >
                  <Plus size={18} color={colors.secondary} />
                  <Text className="text-sm text-secondary font-medium ml-2">
                    {t('dashboard.summary.addMore')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push('/journal/nutrition')}
                haptic="light"
                className="bg-secondary/10 rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-sm text-secondary font-medium">
                  {t('dashboard.summary.logMeal')}
                </Text>
                <Plus size={20} color={colors.secondary} />
              </Pressable>
            )}
          </View>
        )}
      </Pressable>

      {/* Sport Card */}
      <Pressable
        onPress={() => toggleCard('sport')}
        haptic="light"
        className="bg-surface rounded-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Activity size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="text-base font-medium text-text">{t('journal.sport.title')}</Text>
              {sportCount > 0 ? (
                <Text className="text-sm text-textMuted">
                  {sportCount}{' '}
                  {sportCount === 1
                    ? t('dashboard.summary.activity')
                    : t('dashboard.summary.activities')}{' '}
                  · {totalDuration} {t('journal.sport.minutes')}
                </Text>
              ) : (
                <Text className="text-sm text-textMuted">{t('dashboard.summary.notLogged')}</Text>
              )}
            </View>
          </View>
          <ChevronDown
            size={20}
            color={colors.textMuted}
            style={{
              transform: [{ rotate: expandedCard === 'sport' ? '180deg' : '0deg' }],
            }}
          />
        </View>

        {/* Expanded Content */}
        {expandedCard === 'sport' && (
          <View className="px-4 pb-4 border-t border-border pt-4">
            {sportCount > 0 && Array.isArray(sportEntries) ? (
              <View className="gap-3">
                {sportEntries.map((sport) => (
                  <View key={sport.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                        <Activity size={16} color={colors.primary} />
                      </View>
                      <View>
                        <Text className="text-sm font-medium text-text">
                          {getSportTypeLabel(sport.sportType.name, t)}
                        </Text>
                        <Text className="text-xs text-textMuted">
                          {t('dashboard.summary.intensity')} {sport.intensity}/5
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm font-medium text-text">
                      {sport.duration} {t('journal.sport.minutes')}
                    </Text>
                  </View>
                ))}
                {/* Add More Button */}
                <Pressable
                  onPress={() => router.push('/journal/sport')}
                  haptic="light"
                  className="bg-primary/5 rounded-xl p-3 flex-row items-center justify-center mt-2"
                >
                  <Plus size={18} color={colors.primary} />
                  <Text className="text-sm text-primary font-medium ml-2">
                    {t('dashboard.summary.addMore')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push('/journal/sport')}
                haptic="light"
                className="bg-primary/5 rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-sm text-primary font-medium">
                  {t('dashboard.summary.logActivity')}
                </Text>
                <Plus size={20} color={colors.primary} />
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
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

function getSleepQualityLabel(quality: number, t: (key: string) => string): string {
  if (quality === 1 || quality === 2) return t('journal.sleep.quality.bad')
  if (quality === 3) return t('journal.sleep.quality.neutral')
  return t('journal.sleep.quality.good')
}
