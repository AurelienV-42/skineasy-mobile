import { useRef } from 'react'
import { View, Text, Pressable, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { LanguageSwitcher } from '@shared/components/LanguageSwitcher'
import { loginSchema, LoginInput } from '@features/auth/schemas/auth.schema'
import { useLogin } from '@features/auth/hooks/useLogin'

export default function LoginScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()
  const passwordRef = useRef<TextInput>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        router.replace('/(tabs)')
      },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LanguageSwitcher />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl font-bold text-text mb-8">SkinEasy</Text>
          <Text className="text-lg text-text-muted mb-12">{t('auth.login')}</Text>

          <View className="w-full">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.email')}
                  placeholder={t('auth.email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email ? t(errors.email.message as string, { min: 6 }) : undefined}
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
                  placeholder={t('auth.password')}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password ? t(errors.password.message as string, { min: 6 }) : undefined}
                />
              )}
            />

            <Button
              title={t('auth.login')}
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={!isValid}
            />
          </View>

          <Link href="/(auth)/register" asChild>
            <Pressable className="mt-6">
              <Text className="text-primary">
                {t('auth.noAccount')} <Text className="font-bold">{t('auth.register')}</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
