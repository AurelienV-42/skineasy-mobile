import { Control, Controller, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { RegisterInput } from '@features/auth/schemas/auth.schema'
import { Button } from '@shared/components/Button'
import { DateInput } from '@shared/components/DateInput'
import { KeyboardScrollView } from '@shared/components/KeyboardScrollView'
import { Pressable } from '@shared/components/Pressable'

const GENDER_OPTIONS = [
  { value: 1, labelKey: 'auth.genderMr' },
  { value: 2, labelKey: 'auth.genderMrs' },
  { value: 3, labelKey: 'auth.genderOther' },
] as const

interface Step2AboutYouProps {
  onNext: () => void
  onBack: () => void
  control: Control<RegisterInput>
  errors: FieldErrors<RegisterInput>
  isValid: boolean
}

export function Step2AboutYou({
  onNext,
  onBack,
  control,
  errors,
  isValid,
}: Step2AboutYouProps) {
  const { t } = useTranslation()

  return (
    <KeyboardScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={100}
    >
      <View className="flex-1 px-6">
        {/* Step Title */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-text mb-2">
            {t('onboarding.step2.title')}
          </Text>
          <Text className="text-base text-textMuted">
            {t('onboarding.step2.description')}
          </Text>
        </View>

        {/* Form Fields */}
        <View className="flex-1">
          {/* Birthday Input */}
          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, onBlur, value } }) => (
              <DateInput
                label={t('profile.birthday')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
                onSubmitEditing={onNext}
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
                          value === optionValue
                            ? 'text-primary font-medium'
                            : 'text-textMuted'
                        }`}
                      >
                        {t(labelKey)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errors.id_gender && (
                  <Text className="text-xs text-error mt-1 ml-1">
                    {t('auth.genderRequired')}
                  </Text>
                )}
              </View>
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
            onPress={onBack}
            haptic="light"
          />
        </View>
      </View>
    </KeyboardScrollView>
  )
}
