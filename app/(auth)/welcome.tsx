import { useEffect } from 'react'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Image, Linking, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated'

import { BackgroundGradient } from '@shared/components/BackgroundGradient'
import { Button } from '@shared/components/Button'

const ANIMATION_CONFIG = {
  duration: 800,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
  mass: 1,
}

// Stagger delays for sequential entrance
const DELAYS = {
  logo: 0,
  title: 200,
  subtitle: 400,
  primaryButton: 600,
  secondaryButton: 750,
  terms: 900,
}

export default function WelcomeScreen() {
  const { t } = useTranslation()

  // Animation progress values
  const logoProgress = useSharedValue(0)
  const titleProgress = useSharedValue(0)
  const subtitleProgress = useSharedValue(0)
  const primaryButtonProgress = useSharedValue(0)
  const secondaryButtonProgress = useSharedValue(0)
  const termsProgress = useSharedValue(0)

  useEffect(() => {
    // Trigger staggered animations
    logoProgress.value = withDelay(DELAYS.logo, withSpring(1, SPRING_CONFIG))
    titleProgress.value = withDelay(DELAYS.title, withTiming(1, ANIMATION_CONFIG))
    subtitleProgress.value = withDelay(DELAYS.subtitle, withTiming(1, ANIMATION_CONFIG))
    primaryButtonProgress.value = withDelay(DELAYS.primaryButton, withSpring(1, SPRING_CONFIG))
    secondaryButtonProgress.value = withDelay(DELAYS.secondaryButton, withSpring(1, SPRING_CONFIG))
    termsProgress.value = withDelay(DELAYS.terms, withTiming(1, { duration: 600 }))
  }, [])

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoProgress.value,
    transform: [
      { scale: interpolate(logoProgress.value, [0, 1], [0.8, 1]) },
      { translateY: interpolate(logoProgress.value, [0, 1], [-20, 0]) },
    ],
  }))

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [{ translateY: interpolate(titleProgress.value, [0, 1], [20, 0]) }],
  }))

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleProgress.value,
    transform: [{ translateY: interpolate(subtitleProgress.value, [0, 1], [15, 0]) }],
  }))

  const primaryButtonStyle = useAnimatedStyle(() => ({
    opacity: primaryButtonProgress.value,
    transform: [{ translateY: interpolate(primaryButtonProgress.value, [0, 1], [30, 0]) }],
  }))

  const secondaryButtonStyle = useAnimatedStyle(() => ({
    opacity: secondaryButtonProgress.value,
    transform: [{ translateY: interpolate(secondaryButtonProgress.value, [0, 1], [25, 0]) }],
  }))

  const termsStyle = useAnimatedStyle(() => ({
    opacity: termsProgress.value,
  }))

  return (
    <BackgroundGradient>
      <SafeAreaView className="flex-1 px-8">
        <View className="flex-1 justify-between">
          {/* Top Section - Logo & Tagline */}
          <View className="flex-1 items-center justify-center">
            <Animated.View style={logoStyle}>
              <Image
                source={require('@assets/logo.png')}
                className="w-48 h-48"
                resizeMode="contain"
              />
            </Animated.View>

            <View className="mt-8 items-center">
              <Animated.Text
                style={titleStyle}
                className="text-3xl font-bold text-text text-center"
              >
                {t('welcome.title')}
              </Animated.Text>
              <Animated.Text
                style={subtitleStyle}
                className="text-base text-textMuted text-center mt-3 px-4"
              >
                {t('welcome.subtitle')}
              </Animated.Text>
            </View>
          </View>

          {/* Bottom Section - CTAs */}
          <View className="pb-10">
            <Animated.View style={primaryButtonStyle}>
              <Link href="/(auth)/register" asChild>
                <Button title={t('welcome.getStarted')} haptic="heavy" />
              </Link>
            </Animated.View>

            <Animated.View style={secondaryButtonStyle} className="mt-4">
              <Link href="/(auth)/login" asChild>
                <Button title={t('welcome.signIn')} variant="outline" haptic="medium" />
              </Link>
            </Animated.View>

            {/* Terms & Privacy */}
            <Animated.Text
              style={termsStyle}
              className="text-xs text-textMuted text-center mt-6 px-4"
            >
              {t('welcome.termsNoticeStart')}
              <Text
                className="text-xs text-primary underline"
                onPress={() => Linking.openURL(t('profile.termsOfUseUrl'))}
              >
                {t('welcome.termsOfUse')}
              </Text>
              {t('welcome.termsNoticeAnd')}
              <Text
                className="text-xs text-primary underline"
                onPress={() => Linking.openURL(t('profile.privacyPolicyUrl'))}
              >
                {t('welcome.privacyPolicy')}
              </Text>
            </Animated.Text>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  )
}
