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
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useRegister } from '@features/auth/hooks/useRegister'
import { RegisterInput, registerSchema } from '@features/auth/schemas/auth.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const { mutate: register, isPending } = useRegister()
  const lastnameRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<RegisterInput>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: RegisterInput) => {
    setHasAttemptedSubmit(true)
    register(data)
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
          onScrollBeginDrag={Keyboard.dismiss}
        >
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
                <Text className="text-3xl font-bold text-text mb-2">{t('auth.register')}</Text>
                <Text className="text-base text-textMuted">{t('auth.createAccountSubtitle')}</Text>
              </View>

              {/* Form Section */}
              <View>
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('auth.firstname')}
                      autoCapitalize="words"
                      autoComplete="given-name"
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={() => lastnameRef.current?.focus()}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true })
                        }, 100)
                      }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.firstname && (touchedFields.firstname || hasAttemptedSubmit)
                          ? t(errors.firstname.message as string, { min: 2 })
                          : undefined
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={lastnameRef}
                      label={t('auth.lastname')}
                      autoCapitalize="words"
                      autoComplete="family-name"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true })
                        }, 100)
                      }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.lastname && (touchedFields.lastname || hasAttemptedSubmit)
                          ? t(errors.lastname.message as string, { min: 2 })
                          : undefined
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={emailRef}
                      label={t('auth.email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true })
                        }, 100)
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
                      autoComplete="new-password"
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

                {/* TODO: Add DateInput with new picker solution */}

                <Button
                  title={t('auth.register')}
                  onPress={handleSubmit(onSubmit)}
                  loading={isPending}
                  disabled={!isValid}
                />
              </View>
            </View>

            {/* Footer Section - Bottom */}
            <View className="pb-10 items-center">
              <Link href="/(auth)/login" asChild>
                <Pressable haptic="light">
                  <Text className="text-sm text-primary">
                    {t('auth.hasAccount')}{' '}
                    <Text className="text-primary font-bold text-base">{t('auth.login')}</Text>
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
