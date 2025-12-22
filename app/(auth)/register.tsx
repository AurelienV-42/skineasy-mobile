import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Image, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useRegister } from '@features/auth/hooks/useRegister'
import { RegisterInput, registerSchema } from '@features/auth/schemas/auth.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { KeyboardScrollView } from '@shared/components/KeyboardScrollView'
import { Pressable } from '@shared/components/Pressable'

const GENDER_OPTIONS = [
  { value: 1, labelKey: 'auth.genderMr' },
  { value: 2, labelKey: 'auth.genderMrs' },
  { value: 3, labelKey: 'auth.genderOther' },
] as const

export default function RegisterScreen() {
  const { t } = useTranslation()
  const { mutate: register, isPending } = useRegister()
  const lastnameRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
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
      id_gender: undefined,
    },
  })

  const onSubmit = (data: RegisterInput) => {
    setHasAttemptedSubmit(true)
    register(data)
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardScrollView contentContainerStyle={{ flexGrow: 1 }} bottomOffset={220}>
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

              {/* Gender Selector */}
              <Controller
                control={control}
                name="id_gender"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-6">
                    <Text className="text-sm font-medium text-textMuted mb-3">
                      {t('auth.gender')}
                    </Text>
                    <View className="flex-row gap-3">
                      {GENDER_OPTIONS.map(({ value: optionValue, labelKey }) => (
                        <Pressable
                          key={optionValue}
                          onPress={() => onChange(optionValue)}
                          haptic="light"
                          className={`flex-1 items-center justify-center py-3 rounded-xl border-2 ${
                            value === optionValue
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-surface'
                          }`}
                        >
                          <Text
                            className={`text-sm ${
                              value === optionValue ? 'text-primary font-medium' : 'text-textMuted'
                            }`}
                          >
                            {t(labelKey)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    {errors.id_gender && hasAttemptedSubmit && (
                      <Text className="text-xs text-error mt-1 ml-1">
                        {t('auth.genderRequired')}
                      </Text>
                    )}
                  </View>
                )}
              />

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
      </KeyboardScrollView>
    </SafeAreaView>
  )
}
