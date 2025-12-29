import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Alert, Text, View } from 'react-native'

import { ProcessingBanner } from '@features/routine/components/ProcessingBanner'
import { ViewRoutineBanner } from '@features/routine/components/ViewRoutineBanner'
import { Button } from '@shared/components/Button'
import { QuizBanner } from '@shared/components/QuizBanner'
import { useUserStore } from '@shared/stores/user.store'

export function RoutineBannerContainer() {
  const { t } = useTranslation()
  const router = useRouter()
  const routineStatus = useUserStore((state) => state.routineStatus)
  const rspid = useUserStore((state) => state.rspid)
  const setRspid = useUserStore((state) => state.setRspid)
  const setRoutineStatus = useUserStore((state) => state.setRoutineStatus)

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

      {/* Debug buttons - DEV only */}
      {__DEV__ && (
        <View className="mt-4 gap-2">
          <Text className="text-xs text-textMuted mb-2">Debug Controls (DEV only)</Text>
          <Button
            variant="outline"
            title="Simulate Quiz Complete (Processing)"
            onPress={() => {
              const fakeRspid = `debug-${Date.now()}`
              setRspid(fakeRspid)
              Alert.alert(t('routine.processingTitle'), t('routine.processingMessage'), [
                { text: t('common.confirm') },
              ])
            }}
          />
          <Button
            variant="outline"
            title="Simulate Routine Ready"
            onPress={() => {
              setRoutineStatus('ready')
            }}
          />
          <Button
            variant="outline"
            title="Reset to None"
            onPress={() => {
              setRoutineStatus('none')
            }}
          />
        </View>
      )}
    </View>
  )
}
