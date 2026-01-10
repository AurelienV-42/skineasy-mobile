import { useRouter } from 'expo-router'
import { ChevronDown, Frown, Meh, Moon, Plus, Smile, Trash2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Alert, Text, View } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import type { SleepEntry } from '@shared/types/journal.types'
import { colors } from '@theme/colors'

interface SleepSummaryCardProps {
  entry: SleepEntry | null
  expanded: boolean
  onToggle: () => void
  canLogEntries: boolean
  isPastDate: boolean
  onDelete?: (id: number) => void
  onEdit?: (entry: SleepEntry) => void
}

export function SleepSummaryCard({
  entry,
  expanded,
  onToggle,
  canLogEntries,
  isPastDate,
  onDelete,
  onEdit,
}: SleepSummaryCardProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const QualityIcon =
    entry?.quality === 1 || entry?.quality === 2 ? Frown : entry?.quality === 3 ? Meh : Smile

  const confirmDelete = () => {
    if (!entry) return
    Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => onDelete?.(entry.id) },
    ])
  }

  const getQualityLabel = (quality: number): string => {
    if (quality === 1 || quality === 2) return t('journal.sleep.quality.bad')
    if (quality === 3) return t('journal.sleep.quality.neutral')
    return t('journal.sleep.quality.good')
  }

  const isDisabled = isPastDate && !entry

  return (
    <Pressable
      onPress={() => !isDisabled && onToggle()}
      haptic={isDisabled ? undefined : 'light'}
      className="bg-surface rounded-2xl border border-border overflow-hidden"
    >
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
            <Moon size={20} color={colors.primary} />
          </View>
          <View>
            <Text className="text-base font-medium text-text">{t('journal.sleep.title')}</Text>
            {entry ? (
              <Text className="text-sm text-textMuted">
                {entry.hours}h · {getQualityLabel(entry.quality)}
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
          {entry ? (
            <Pressable
              onPress={() => onEdit?.(entry)}
              haptic="light"
              className="flex-row items-center gap-4"
            >
              <View className="items-center">
                <QualityIcon size={40} color={colors.primary} strokeWidth={2} />
                <Text className="text-xs text-textMuted mt-1">
                  {getQualityLabel(entry.quality)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-text">{entry.hours}h</Text>
                <Text className="text-sm text-textMuted">{t('journal.sleep.hours')}</Text>
              </View>
              <Pressable
                onPress={confirmDelete}
                haptic="light"
                className="p-2"
                accessibilityLabel={t('common.delete')}
              >
                <Trash2 size={20} color={colors.error} />
              </Pressable>
            </Pressable>
          ) : canLogEntries ? (
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
          ) : null}
        </View>
      )}
    </Pressable>
  )
}
