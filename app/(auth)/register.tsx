import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { registerSchema, RegisterInput } from '@features/auth/schemas/auth.schema'
import { useRegister } from '@features/auth/hooks/useRegister'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { mutate: register, isPending } = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => {
        router.replace('/(tabs)')
      },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-8">
            <Text className="text-3xl font-bold text-text mb-8">SkinEasy</Text>
            <Text className="text-lg text-text-muted mb-12">{t('auth.register')}</Text>

            <View className="w-full">
              <Controller
                control={control}
                name="firstname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.firstname')}
                    placeholder={t('auth.firstname')}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.firstname ? t(errors.firstname.message as string, { min: 2 }) : undefined}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.lastname')}
                    placeholder={t('auth.lastname')}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.lastname ? t(errors.lastname.message as string, { min: 2 }) : undefined}
                  />
                )}
              />

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
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email ? t(errors.email.message as string) : undefined}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.password')}
                    placeholder={t('auth.password')}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password ? t(errors.password.message as string, { min: 6 }) : undefined}
                  />
                )}
              />

              <Button
                title={t('auth.register')}
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
              />
            </View>

            <Link href="/(auth)/login" asChild>
              <Pressable className="mt-6">
                <Text className="text-primary">
                  {t('auth.hasAccount')} <Text className="font-bold">{t('auth.login')}</Text>
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
