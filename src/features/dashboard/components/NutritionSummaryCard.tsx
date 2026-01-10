import { useRouter } from 'expo-router'
import { ChevronDown, Plus, Trash2, Utensils } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Alert, Image, Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import type { MealEntry } from '@shared/types/journal.types'
import { getImageUrl } from '@shared/utils/image'
import { colors } from '@theme/colors'

interface NutritionSummaryCardProps {
  entries: MealEntry[]
  expanded: boolean
  onToggle: () => void
  canLogEntries: boolean
  isPastDate: boolean
  onDelete?: (id: number) => void
  onEdit?: (entry: MealEntry) => void
}

export function NutritionSummaryCard({
  entries,
  expanded,
  onToggle,
  canLogEntries,
  isPastDate,
  onDelete,
  onEdit,
}: NutritionSummaryCardProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const mealCount = entries.length

  const confirmDelete = (id: number) => {
    Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => onDelete?.(id) },
    ])
  }

  const isDisabled = isPastDate && mealCount === 0

  return (
    <Pressable
      onPress={() => !isDisabled && onToggle()}
      haptic={isDisabled ? undefined : 'light'}
      className="bg-surface rounded-2xl border border-border overflow-hidden"
    >
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
            <Utensils size={20} color={colors.secondary} />
          </View>
          <View>
            <Text className="text-base font-medium text-text">{t('journal.nutrition.title')}</Text>
            {mealCount > 0 ? (
              <Text className="text-sm text-textMuted">
                {mealCount}{' '}
                {mealCount === 1 ? t('dashboard.summary.meal') : t('dashboard.summary.meals')}
              </Text>
            ) : (
              <Text className="text-sm text-textMuted">
                {isPastDate ? t('dashboard.summary.noLogs') : t('dashboard.summary.notLogged')}
              </Text>
            )}
          </View>
        </View>
        {!isDisabled && (
          <ChevronDown
            size={20}
            color={colors.textMuted}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
        )}
      </View>

      {expanded && (
        <View className="px-4 pb-4 border-t border-border pt-4">
          {mealCount > 0 ? (
            <View className="gap-3">
              {entries.map((meal) => {
                const imageUrl = getImageUrl(meal.photo_url)
                return (
                  <Pressable
                    key={meal.id}
                    onPress={() => onEdit?.(meal)}
                    haptic="light"
                    className="flex-row gap-3"
                  >
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-16 h-16 rounded-lg bg-border"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-lg bg-secondary/20 items-center justify-center">
                        <Utensils size={24} color={colors.secondary} />
                      </View>
                    )}
                    <View className="flex-1 justify-center">
                      {meal.food_name && (
                        <Text className="text-sm font-medium text-text" numberOfLines={1}>
                          {meal.food_name}
                        </Text>
                      )}
                      {meal.meal_type ? (
                        <Text className="text-xs text-primary">
                          {t(`dashboard.summary.mealType.${meal.meal_type.toLowerCase()}`)}
                        </Text>
                      ) : !meal.food_name ? (
                        <Text className="text-sm font-medium text-text">
                          {t('journal.nutrition.meal')}
                        </Text>
                      ) : null}
                      {meal.note && (
                        <Text className="text-sm text-textMuted mt-1" numberOfLines={1}>
                          {meal.note}
                        </Text>
                      )}
                    </View>
                    <Pressable
                      onPress={() => confirmDelete(meal.id)}
                      haptic="light"
                      className="p-2 self-center"
                      accessibilityLabel={t('common.delete')}
                    >
                      <Trash2 size={18} color={colors.error} />
                    </Pressable>
                  </Pressable>
                )
              })}
              {canLogEntries && (
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
              )}
            </View>
          ) : canLogEntries ? (
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
          ) : null}
        </View>
      )}
    </Pressable>
  )
}
