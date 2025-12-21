import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Moon, UtensilsCrossed, Dumbbell } from 'lucide-react-native'

import { useUserStore } from '@shared/stores/user.store'
import { JournalCard } from '@shared/components/JournalCard'
import { colors } from '@theme/colors'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-text mb-2">
          {t('dashboard.greeting', { name: user?.firstname || 'User' })}
        </Text>
        <Text className="text-sm text-text-muted mb-6">{t('dashboard.reminder')}</Text>

        {/* Journal Cards - Single Row */}
        <View className="flex-row gap-3">
          <JournalCard
            icon={<Moon size={48} color={colors.primary} strokeWidth={1.5} />}
            title={t('journal.sleep.title')}
            onPress={() => router.push('/journal/sleep')}
          />
          <JournalCard
            icon={<UtensilsCrossed size={48} color={colors.primary} strokeWidth={1.5} />}
            title={t('journal.nutrition.title')}
            onPress={() => router.push('/journal/nutrition')}
          />
          <JournalCard
            icon={<Dumbbell size={48} color={colors.primary} strokeWidth={1.5} />}
            title={t('journal.sport.title')}
            onPress={() => router.push('/journal/sport')}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
