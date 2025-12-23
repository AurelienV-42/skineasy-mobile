import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, View } from 'react-native'

import { RegisterInput } from '@features/auth/schemas/auth.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { KeyboardScrollView } from '@shared/components/KeyboardScrollView'

interface Step1NameProps {
  onNext: () => void
  control: Control<RegisterInput>
  errors: FieldErrors<RegisterInput>
  isValid: boolean
}

export function Step1Name({ onNext, control, errors, isValid }: Step1NameProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const lastnameRef = useRef<TextInput>(null)

  return (
    <KeyboardScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={100}
    >
      <View className="flex-1 px-6">
        {/* Step Title */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-text mb-2">
            {t('onboarding.step1.title')}
          </Text>
          <Text className="text-base text-textMuted">
            {t('onboarding.step1.description')}
          </Text>
        </View>

        {/* Form Fields */}
        <View className="flex-1">
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
                  errors.firstname
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
                returnKeyType="done"
                onSubmitEditing={onNext}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={
                  errors.lastname
                    ? t(errors.lastname.message as string, { min: 2 })
                    : undefined
                }
              />
            )}
          />
        </View>

        {/* Navigation Buttons */}
        <View className="pb-8 gap-3">
          <Button
            title={t('onboarding.next')}
            onPress={onNext}
            disabled={!isValid}
            haptic="medium"
          />
          <Button
            title={t('onboarding.back')}
            variant="outline"
            onPress={() => router.back()}
            haptic="light"
          />
        </View>
      </View>
    </KeyboardScrollView>
  )
}
