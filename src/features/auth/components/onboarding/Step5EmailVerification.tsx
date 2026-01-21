import { MailWarning } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Background } from '@shared/components/Background'
import { GlassContainer } from '@shared/components/GlassContainer'
import { colors } from '@theme/colors'

interface Step5EmailVerificationProps {
  email: string
}

export function Step5EmailVerification({ email }: Step5EmailVerificationProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <Background variant="brownGradient">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-center items-center">
          {/* Icon Container */}
          <GlassContainer style={{ padding: 16, marginBottom: 16 }}>
            <MailWarning size={46} color={colors.surface} strokeWidth={3} />
          </GlassContainer>

          {/* Title & Subtitle */}
          <Text className="text-4xl font-bold text-cream text-center mb-2">
            {t('onboarding.step5.title')}
          </Text>
          <Text className="text-base font-medium text-cream text-center">
            {t('onboarding.step5.subtitle', { email })}
          </Text>
        </View>
      </SafeAreaView>
    </Background>
  )
}
