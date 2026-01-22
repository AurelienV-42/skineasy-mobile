import { ListChecks, Sun } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Text, View } from 'react-native'

import assets from 'assets'

import { Button } from '@shared/components/Button'
import { colors } from '@theme/colors'

interface RoutineBannerProps {
  onPress?: () => void
}

export function RoutineBanner({ onPress }: RoutineBannerProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <ImageBackground
      source={assets.bubbleRoutine}
      className="rounded-2xl overflow-hidden p-5"
      imageStyle={{ borderRadius: 16, opacity: 0.8 }}
    >
      <View className="gap-3">
        <Text className="text-xl font-bold text-brown-dark">{t('dashboard.routine.title')}</Text>
        <Text className="text-base text-brown-dark leading-6">
          {t('dashboard.routine.description')}
        </Text>
        <Button
          title={t('dashboard.routine.discover')}
          iconLeft={ListChecks}
          className="mt-4 rounded-full"
          onPress={onPress}
        />
      </View>
    </ImageBackground>
  )
}

function RoutineSectionHeader(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <View className="flex-row items-center gap-2 px-4 mb-5">
      <View
        className="p-2 rounded-md items-center justify-center border border-brown-dark/20"
        style={{ backgroundColor: colors.brownDark + '10' }}
      >
        <Sun size={16} color={colors.brownDark} strokeWidth={2.5} />
      </View>
      <Text className="text-brown-dark font-semibold">{t('routine.title')}</Text>
    </View>
  )
}

interface RoutineBannerContainerProps {
  onPress?: () => void
}

export function RoutineBannerContainer({
  onPress,
}: RoutineBannerContainerProps): React.ReactElement {
  return (
    <View>
      <RoutineSectionHeader />
      <View className="px-4">
        <RoutineBanner onPress={onPress} />
      </View>
    </View>
  )
}
