import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useLogin } from '@features/auth/hooks/useLogin'
import { LoginInput, loginSchema } from '@features/auth/schemas/auth.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'

export default function LoginScreen() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const passwordRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)


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
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 px-8 justify-between" style={{ minHeight: '100%' }}>
              <View>
                {/* Logo Section - Minimal top */}
                <View className="pt-8 pb-8 items-center">
                  <Image
                    source={require('@assets/logo.png')}
                    className="w-40 h-40"
                    resizeMode="contain"
                  />
                </View>

                {/* Welcome Text */}
                <View className="mb-10">
                  <Text className="text-3xl font-bold text-text mb-2">{t('auth.welcomeBack')}</Text>
                  <Text className="text-base text-textMuted">{t('auth.signInToContinue')}</Text>
                </View>

                {/* Form Section */}
                <View>
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
                        onFocus={() => {
                          setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true })
                          }, 500)
                        }}
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
                        onFocus={() => {
                          setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true })
                          }, 100)
                        }}
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
                </View>
              </View>

              {/* Footer Section - Bottom */}
              <View className="pb-10 items-center pt-4">
                <Link href="/(auth)/register" asChild>
                  <Pressable haptic="light">
                    <Text className="text-sm text-primary">
                      {t('auth.noAccount')}{' '}
                      <Text className="text-primary font-bold text-base">{t('auth.register')}</Text>
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
