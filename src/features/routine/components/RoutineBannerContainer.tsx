import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Alert, View } from 'react-native'

import { ProcessingBanner } from '@features/routine/components/ProcessingBanner'
import { ViewRoutineBanner } from '@features/routine/components/ViewRoutineBanner'
import { QuizBanner } from '@shared/components/QuizBanner'
import { useUserStore } from '@shared/stores/user.store'

export function RoutineBannerContainer() {
  const { t } = useTranslation()
  const router = useRouter()
  const routineStatus = useUserStore((state) => state.routineStatus)
  const rspid = useUserStore((state) => state.rspid)

  const handleQuizPress = () => {
    router.push('/diagnosis/quiz')
  }

  const handleProcessingPress = () => {
    Alert.alert(t('routine.processingTitle'), t('routine.processingMessage'), [
      { text: t('common.ok') },
    ])
  }

  const handleViewRoutine = () => {
    router.push({ pathname: '/routine/results', params: { rspid } })
  }

  return (
    <View>
      {/* Banner based on status */}
      {routineStatus === 'none' && <QuizBanner onPress={handleQuizPress} />}
      {routineStatus === 'processing' && <ProcessingBanner onPress={handleProcessingPress} />}
      {routineStatus === 'ready' && <ViewRoutineBanner onPress={handleViewRoutine} />}
    </View>
  )
}
