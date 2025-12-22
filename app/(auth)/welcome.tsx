import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@shared/components/Button'

export default function WelcomeScreen() {
  const { t } = useTranslation()

  return (
    <LinearGradient
      colors={['#FFF9F5', '#FFEEE5', '#FFF9F5']}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1 px-8">
        <View className="flex-1 justify-between">
          {/* Top Section - Logo & Tagline */}
          <View className="flex-1 items-center justify-center">
            <Image
              source={require('@assets/logo.png')}
              className="w-48 h-48"
              resizeMode="contain"
            />

            <View className="mt-8 items-center">
              <Text className="text-3xl font-bold text-text text-center">{t('welcome.title')}</Text>
              <Text className="text-base text-textMuted text-center mt-3 px-4">
                {t('welcome.subtitle')}
              </Text>
            </View>
          </View>

          {/* Bottom Section - CTAs */}
          <View className="pb-10">
            <Link href="/(auth)/register" asChild>
              <Button title={t('welcome.getStarted')} haptic="heavy" />
            </Link>

            <Link href="/(auth)/login" asChild>
              <Button
                title={t('welcome.signIn')}
                variant="outline"
                className="mt-4"
                haptic="medium"
              />
            </Link>

            {/* Terms & Privacy */}
            <Text className="text-xs text-textMuted text-center mt-6 px-4">
              {t('welcome.termsNotice')}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})
