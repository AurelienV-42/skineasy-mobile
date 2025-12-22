import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useUpdateProfile } from '@features/profile/hooks/useUpdateProfile'
import { editProfileSchema, type EditProfileInput } from '@features/profile/schemas/profile.schema'
import { Button } from '@shared/components/Button'
import { DateInput } from '@shared/components/DateInput'
import { Input } from '@shared/components/Input'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import { useUserStore } from '@shared/stores/user.store'

export default function EditProfileScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      birthday: user?.birthday || undefined,
    },
  })

  const handleFormSubmit = async (data: EditProfileInput) => {
    await updateProfile(data)
    router.back()
  }

  return (
    <ScreenHeader title={t('profile.editProfile')}>
      <View className="opacity-50">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="firstname"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.firstname')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstname?.message}
            autoCapitalize="words"
            editable={!isUpdating}
          />
        )}
      />

      <Controller
        control={control}
        name="lastname"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.lastname')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.lastname?.message}
            autoCapitalize="words"
            editable={!isUpdating}
          />
        )}
      />

      <Controller
        control={control}
        name="birthday"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateInput
            label={t('profile.birthday')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.birthday?.message}
            editable={!isUpdating}
          />
        )}
      />

      <View className="mt-6">
        <Button
          title={t('common.save')}
          onPress={handleSubmit(handleFormSubmit)}
          loading={isUpdating}
          disabled={!isDirty || isUpdating}
        />
      </View>
    </ScreenHeader>
  )
}
