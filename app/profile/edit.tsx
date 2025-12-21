import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import { Calendar, ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
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
import { toUTCDateString } from '@shared/utils/date'
import { colors } from '@theme/colors'

export default function EditProfileScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      birthday: user?.birthday || undefined,
    },
  })

  const birthday = watch('birthday')

  // Format birthday for display: YYYY-MM-DD -> DD-MM-YYYY
  const formatBirthdayForDisplay = (dateString?: string): string => {
    if (!dateString) return t('profile.selectBirthday')

    // Handle different date formats - try to parse as Date first
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
      }
    } catch (error) {
      // Fallback to split method if Date parsing fails
    }

    // Fallback: assume YYYY-MM-DD format
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}-${month}-${year}`
    }

    return t('profile.selectBirthday')
  }

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
                    placeholder={t('profile.emailReadOnly')}
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
            <View className="mb-4">
              <Text className="text-sm font-medium text-text mb-2">{t('profile.birthday')}</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                haptic="light"
                className="w-full h-12 bg-surface border border-border rounded-md px-4 flex-row items-center justify-between"
                accessibilityLabel={t('profile.selectBirthday')}
              >
                <Text className={birthday ? 'text-text' : 'text-textLight'}>
                  {formatBirthdayForDisplay(birthday)}
                </Text>
                <Calendar size={20} color={colors.primary} />
              </Pressable>

              {/* Date Picker */}
              {showDatePicker && (
                <View>
                  <DateTimePicker
                    value={birthday ? new Date(birthday) : new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        setShowDatePicker(false)
                      }
                      if (selectedDate) {
                        setValue('birthday', toUTCDateString(selectedDate), { shouldDirty: true })
                      }
                    }}
                    maximumDate={new Date()}
                  />
                  {Platform.OS === 'ios' && (
                    <Pressable
                      onPress={() => setShowDatePicker(false)}
                      haptic="light"
                      className="bg-primary rounded-lg py-3 items-center mt-2"
                    >
                      <Text className="text-white font-medium">{t('common.done')}</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>

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
