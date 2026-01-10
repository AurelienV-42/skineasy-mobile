import { useRouter } from 'expo-router'
import { Activity, ChevronDown, Plus, Trash2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Alert, Text, View } from 'react-native'

import { getSportTypeLabel } from '@features/journal/utils/sportMapping'
import { Pressable } from '@shared/components/Pressable'
import type { SportEntry } from '@shared/types/journal.types'
import { colors } from '@theme/colors'

interface SportSummaryCardProps {
  entries: SportEntry[]
  expanded: boolean
  onToggle: () => void
  canLogEntries: boolean
  isPastDate: boolean
  onDelete?: (id: number) => void
  onEdit?: (entry: SportEntry) => void
}

export function SportSummaryCard({
  entries,
  expanded,
  onToggle,
  canLogEntries,
  isPastDate,
  onDelete,
  onEdit,
}: SportSummaryCardProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const sportCount = entries.length
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0)

  const confirmDelete = (id: number) => {
    Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => onDelete?.(id) },
    ])
  }

  const isDisabled = isPastDate && sportCount === 0

  return (
    <Pressable
      onPress={() => !isDisabled && onToggle()}
      haptic={isDisabled ? undefined : 'light'}
      className="bg-surface rounded-2xl border border-border overflow-hidden"
    >
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
          {sportCount > 0 ? (
            <View className="gap-3">
              {entries.map((sport) => (
                <Pressable
                  key={sport.id}
                  onPress={() => onEdit?.(sport)}
                  haptic="light"
                  className="gap-2"
                >
                  <View className="flex-row items-center justify-between">
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
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-medium text-text">
                        {sport.duration} {t('journal.sport.minutes')}
                      </Text>
                      <Pressable
                        onPress={() => confirmDelete(sport.id)}
                        haptic="light"
                        className="p-2"
                        accessibilityLabel={t('common.delete')}
                      >
                        <Trash2 size={18} color={colors.error} />
                      </Pressable>
                    </View>
                  </View>
                  {sport.note && (
                    <Text className="text-xs text-textMuted italic pl-11" numberOfLines={1}>
                      &ldquo;{sport.note}&rdquo;
                    </Text>
                  )}
                </Pressable>
              ))}
              {canLogEntries && (
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
              )}
            </View>
          ) : canLogEntries ? (
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
          ) : null}
        </View>
      )}
    </Pressable>
  )
}
