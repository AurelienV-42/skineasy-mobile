/**
 * Nutrition Screen
 *
 * Allows users to log meals/snacks with:
 * - Photo upload (camera or gallery)
 * - Optional note (max 500 characters)
 * - Optional meal type (breakfast, lunch, dinner, snack)
 *
 * Connected to real backend API with image upload and validation
 */

import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { Camera, Coffee, Cookie, ImageIcon, Moon, Sun, X } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, Image, Text, View } from 'react-native'

import { useCreateMeal, useUploadMealImage } from '@features/journal/hooks/useJournal'
import { mealFormSchema, type MealFormInput } from '@features/journal/schemas/journal.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { JournalLayout } from '@shared/components/ScreenHeader'
import { getTodayUTC } from '@shared/utils/date'
import { colors } from '@theme/colors'

const MEAL_TYPES = [
  { id: 'breakfast', icon: Coffee },
  { id: 'lunch', icon: Sun },
  { id: 'dinner', icon: Moon },
  { id: 'snack', icon: Cookie },
] as const

export default function NutritionScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const uploadImage = useUploadMealImage()
  const createMeal = useCreateMeal()
  const [imageUri, setImageUri] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MealFormInput>({
    resolver: zodResolver(mealFormSchema),
    mode: 'onChange',
  })

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(t('common.error'), t('journal.nutrition.galleryPermissionRequired'))
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(t('common.error'), t('journal.nutrition.cameraPermissionRequired'))
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const removeImage = () => {
    setImageUri(null)
  }

  const onSubmit = async (data: MealFormInput) => {
    if (!imageUri) return

    try {
      // Upload image first (returns URL string)
      const photoUrl = await uploadImage.mutateAsync(imageUri)

      // Create meal entry with uploaded image URL
      const dto = {
        date: getTodayUTC(),
        photo_url: photoUrl,
        food_name: data.food_name,
        note: data.note || null,
        meal_type: data.meal_type || null,
      }

      createMeal.mutate(dto, {
        onSuccess: () => {
          router.back()
        },
      })
    } catch {
      // Error is already handled by uploadImage mutation
    }
  }

  const isLoading = uploadImage.isPending || createMeal.isPending

  return (
    <JournalLayout title={t('journal.nutrition.screenTitle')}>
      {/* Image Picker */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-text mb-3">{t('journal.nutrition.addMeal')}</Text>

        {imageUri ? (
          <View className="relative">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-64 rounded-xl"
              resizeMode="cover"
            />
            <Pressable
              onPress={removeImage}
              className="absolute top-2 right-2 bg-error rounded-full p-2"
              accessibilityLabel={t('common.delete')}
              haptic="light"
            >
              <X size={20} color="#FFF" />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row gap-3">
            <Pressable
              onPress={takePhoto}
              className="flex-1 bg-surface border-2 border-dashed border-border rounded-xl py-8 items-center justify-center"
              accessibilityLabel={t('journal.nutrition.takePhoto')}
              haptic="light"
            >
              <Camera size={32} color={colors.primary} strokeWidth={2} />
              <Text className="text-sm text-textMuted mt-2">
                {t('journal.nutrition.takePhoto')}
              </Text>
            </Pressable>

            <Pressable
              onPress={pickImage}
              className="flex-1 bg-surface border-2 border-dashed border-border rounded-xl py-8 items-center justify-center"
              accessibilityLabel={t('journal.nutrition.gallery')}
              haptic="light"
            >
              <ImageIcon size={32} color={colors.primary} strokeWidth={2} />
              <Text className="text-sm text-textMuted mt-2">{t('journal.nutrition.gallery')}</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Food Name Input */}
      <View className="mb-6">
        <Controller
          control={control}
          name="food_name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('journal.nutrition.foodName')}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={200}
              error={errors.food_name?.message ? t(errors.food_name.message as string) : undefined}
            />
          )}
        />
      </View>

      {/* Meal Type Selector */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-text mb-3">
          {t('journal.nutrition.mealType')}
        </Text>
        <Controller
          control={control}
          name="meal_type"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row gap-2">
              {MEAL_TYPES.map((mealType) => {
                const Icon = mealType.icon
                const isSelected = value === mealType.id
                return (
                  <Pressable
                    key={mealType.id}
                    onPress={() => onChange(isSelected ? null : mealType.id)}
                    haptic="light"
                    className={`flex-1 items-center justify-center py-3 rounded-xl border ${
                      isSelected
                        ? 'bg-secondary border-secondary'
                        : 'bg-surface border-border'
                    }`}
                    accessibilityLabel={t(`dashboard.summary.mealType.${mealType.id}`)}
                  >
                    <Icon
                      size={24}
                      color={isSelected ? '#FFF' : colors.textMuted}
                      strokeWidth={2}
                    />
                    <Text
                      className={`text-xs mt-1 ${
                        isSelected ? 'text-white font-medium' : 'text-textMuted'
                      }`}
                    >
                      {t(`dashboard.summary.mealType.${mealType.id}`)}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          )}
        />
      </View>

      {/* Note Input */}
      <View className="mb-6">
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('journal.nutrition.addNote')}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={3}
              error={errors.note?.message ? t(errors.note.message as string) : undefined}
            />
          )}
        />
      </View>

      {/* Save Button */}
      <Button
        title={t('common.save')}
        onPress={handleSubmit(onSubmit)}
        disabled={!imageUri || !isValid || isLoading}
        loading={isLoading}
      />
    </JournalLayout>
  )
}
