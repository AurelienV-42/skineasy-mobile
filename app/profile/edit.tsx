import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useUpdateProfile } from '@features/profile/hooks/useUpdateProfile'
import { editProfileSchema, type EditProfileInput } from '@features/profile/schemas/profile.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { useUserStore } from '@shared/stores/user.store'
import { colors } from '@theme/colors'

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
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <Pressable onPress={() => router.back()} accessibilityLabel={t('common.back')}>
          <ChevronLeft size={28} color={colors.text} />
        </Pressable>
        <Text className="text-3xl font-bold text-primary">{t('profile.editProfile')}</Text>
        <View className="w-7" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="px-4 pb-8">
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

            {/* Birthday Picker */}

            <View className="mt-6">
              <Button
                title={t('common.save')}
                onPress={handleSubmit(handleFormSubmit)}
                loading={isUpdating}
                disabled={!isDirty || isUpdating}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
