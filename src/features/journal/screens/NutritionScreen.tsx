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
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Camera, Coffee, Cookie, ImageIcon, Moon, Sun, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, Image, Text, View } from 'react-native'

import {
  useCreateMeal,
  useMealEntries,
  useUpdateMeal,
  useUploadMealImage,
} from '@features/journal/hooks/useJournal'
import { mealFormSchema, type MealFormInput } from '@features/journal/schemas/journal.schema'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Pressable } from '@shared/components/Pressable'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import { ENV } from '@shared/config/env'
import { getTodayUTC, toISODateString } from '@shared/utils/date'
import { colors } from '@theme/colors'

const MEAL_TYPES = [
  { id: 'breakfast', icon: Coffee },
  { id: 'lunch', icon: Sun },
  { id: 'dinner', icon: Moon },
  { id: 'snack', icon: Cookie },
] as const

/**
 * Build full image URL from relative path
 */
function getImageUrl(path: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${ENV.API_URL}${path}`
}

export default function NutritionScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useLocalSearchParams<{ id?: string; date?: string }>()
  const uploadImage = useUploadMealImage()
  const createMeal = useCreateMeal()
  const updateMeal = useUpdateMeal()

  // If editing, fetch existing entry
  const dateToUse = params.date || getTodayUTC()
  const { data: mealEntries } = useMealEntries(dateToUse)
  const existingEntry = mealEntries?.find((e) => e.id === Number(params.id))
  const isEditMode = !!params.id

  // Track if user has changed the image from the original
  const [localImageUri, setLocalImageUri] = useState<string | null>(null)
  const [imageWasModified, setImageWasModified] = useState(false)

  // Compute effective image URI: use local if modified, else use existing entry's image
  const imageUri = imageWasModified
    ? localImageUri
    : existingEntry?.photo_url
      ? getImageUrl(existingEntry.photo_url)
      : null

  const setImageUri = (uri: string | null) => {
    setImageWasModified(true)
    setLocalImageUri(uri)
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<MealFormInput>({
    resolver: zodResolver(mealFormSchema),
    mode: 'onChange',
  })

  // Populate form when editing
  useEffect(() => {
    if (existingEntry) {
      reset({
        food_name: existingEntry.food_name || '',
        note: existingEntry.note || '',
        meal_type: existingEntry.meal_type || undefined,
      })
    }
  }, [existingEntry, reset])

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
    try {
      let photoUrl: string | null = existingEntry?.photo_url || null

      // Only process image changes if user modified it
      if (imageWasModified) {
        if (localImageUri) {
          // Upload new local image
          photoUrl = await uploadImage.mutateAsync(localImageUri)
        } else {
          // Image was removed
          photoUrl = null
        }
      }

      const dto = {
        date: toISODateString(dateToUse),
        photo_url: photoUrl,
        food_name: data.food_name,
        note: data.note || null,
        meal_type: data.meal_type || null,
      }

      if (isEditMode && existingEntry) {
        // Update existing entry
        updateMeal.mutate(
          { id: existingEntry.id, dto, date: dateToUse },
          {
            onSuccess: () => {
              router.back()
            },
          }
        )
      } else {
        // Create new entry
        createMeal.mutate(dto, {
          onSuccess: () => {
            router.back()
          },
        })
      }
    } catch {
      // Error is already handled by uploadImage mutation
    }
  }

  const isLoading = uploadImage.isPending || createMeal.isPending || updateMeal.isPending

  return (
    <ScreenHeader title={t('journal.nutrition.screenTitle')}>
      {/* Food Name Input */}
      <View>
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
              autoFocus
            />
          )}
        />
      </View>

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
                      isSelected ? 'bg-secondary border-secondary' : 'bg-surface border-border'
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
        disabled={!isValid || isLoading}
        loading={isLoading}
      />
    </ScreenHeader>
  )
}
