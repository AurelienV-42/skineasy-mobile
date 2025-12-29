import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Image, Text, TextInput, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useLogin } from '@features/auth/hooks/useLogin'
import { LoginInput, loginSchema } from '@features/auth/schemas/auth.schema'
import { BackgroundGradient } from '@shared/components/BackgroundGradient'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { KeyboardScrollView } from '@shared/components/KeyboardScrollView'
import { Pressable } from '@shared/components/Pressable'
import { useEntranceAnimation } from '@shared/hooks/useEntranceAnimation'

const logoSource = require('@assets/logo.png')

export default function LoginScreen() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const passwordRef = useRef<TextInput>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const animStyles = useEntranceAnimation(5)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginInput>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginInput) => {
    setHasAttemptedSubmit(true)
    login(data)
  }

  return (
    <BackgroundGradient>
      <SafeAreaView className="flex-1">
        <KeyboardScrollView contentContainerStyle={{ flexGrow: 1 }} bottomOffset={180}>
          <View className="flex-1 px-8 justify-between" style={{ minHeight: '100%' }}>
            <View>
              {/* Logo Section - Minimal top */}
              <Animated.View style={animStyles[0]} className="pt-8 pb-8 items-center">
                <Image
                  source={logoSource}
                  style={{ width: 160, height: 160 }}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Welcome Text */}
              <Animated.View style={animStyles[1]} className="mb-10">
                <Text className="text-3xl font-bold text-text mb-2">{t('auth.welcomeBack')}</Text>
                <Text className="text-base text-textMuted">{t('auth.signInToContinue')}</Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View style={animStyles[2]}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('auth.email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.email && (touchedFields.email || hasAttemptedSubmit)
                          ? t(errors.email.message as string)
                          : undefined
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={passwordRef}
                      label={t('auth.password')}
                      secureTextEntry
                      showPasswordToggle
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.password && (touchedFields.password || hasAttemptedSubmit)
                          ? t(errors.password.message as string, { min: 6 })
                          : undefined
                      }
                    />
                  )}
                />

                {/* Forgot Password Link */}
                <Link href="/(auth)/password-recovery" asChild>
                  <Pressable className="-mt-4 mb-6 self-end" haptic="light">
                    <Text className="text-sm text-primary font-medium">
                      {t('auth.forgotPassword')}
                    </Text>
                  </Pressable>
                </Link>
              </Animated.View>

              <Animated.View style={animStyles[3]}>
                <Button
                  title={t('auth.login')}
                  onPress={handleSubmit(onSubmit)}
                  loading={isPending}
                  disabled={!isValid}
                />

                {__DEV__ && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    title="Login Dev"
                    haptic="medium"
                    onPress={() =>
                      login({
                        email: 'aurelienvpro@gmail.com',
                        password:
                          'Localhost is not in the list of supported domains for this site key.',
                      })
                    }
                  />
                )}
              </Animated.View>
            </View>

            {/* Footer Section - Bottom */}
            <Animated.View style={animStyles[4]} className="pb-10 items-center pt-4">
              <Link href="/(auth)/register" asChild>
                <Pressable haptic="light">
                  <Text className="text-sm text-primary">
                    {t('auth.noAccount')}{' '}
                    <Text className="text-primary font-bold text-base">{t('auth.register')}</Text>
                  </Text>
                </Pressable>
              </Link>
            </Animated.View>
          </View>
        </KeyboardScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  )
}
