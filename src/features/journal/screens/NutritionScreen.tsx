import { View, Text, TextInput, Image, Alert } from 'react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Camera, X } from 'lucide-react-native'

import { Button } from '@shared/components/Button'
import { Pressable } from '@shared/components/Pressable'
import { JournalLayout } from '@shared/components/ScreenHeader'
import { logger } from '@shared/utils/logger'
import { colors } from '@theme/colors'

export default function NutritionScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(t('common.error'), 'Permission to access camera roll is required!')
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
      Alert.alert(t('common.error'), 'Permission to access camera is required!')
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

  const handleSave = () => {
    if (imageUri) {
      // TODO: Save to API with image and note
      logger.info('Nutrition data:', { imageUri, note })
      router.back()
    }
  }

  const removeImage = () => {
    setImageUri(null)
  }

  return (
    <JournalLayout title={t('journal.nutrition.screenTitle')}>
      {/* Image Picker */}
      <View className="mb-6">
        <Text className="text-base font-medium text-text mb-3">
          {t('journal.nutrition.addMeal')}
        </Text>

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
              accessibilityLabel="Take photo"
              haptic="light"
            >
              <Camera size={32} color={colors.primary} strokeWidth={2} />
              <Text className="text-sm text-text-muted mt-2">Take Photo</Text>
            </Pressable>

            <Pressable
              onPress={pickImage}
              className="flex-1 bg-surface border-2 border-dashed border-border rounded-xl py-8 items-center justify-center"
              accessibilityLabel="Choose from gallery"
              haptic="light"
            >
              <Camera size={32} color={colors.primary} strokeWidth={2} />
              <Text className="text-sm text-text-muted mt-2">Gallery</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Note Input */}
      <View className="mb-8">
        <Text className="text-base font-medium text-text mb-3">
          {t('journal.nutrition.addNote')}
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Optional note about your meal..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-surface border border-border rounded-lg px-4 py-3 text-base text-text min-h-24"
          placeholderTextColor={colors.textLight}
        />
      </View>

      {/* Save Button */}
      <Button title={t('common.save')} onPress={handleSave} disabled={!imageUri} />
    </JournalLayout>
  )
}
