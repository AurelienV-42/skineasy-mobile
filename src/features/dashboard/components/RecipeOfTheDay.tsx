import { ChevronRight, UtensilsCrossed } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Text, View } from 'react-native'

import { SectionHeader } from '@features/dashboard/components/SectionHeader'
import { Button } from '@shared/components/Button'

// Placeholder recipe data
const PLACEHOLDER_RECIPE = {
  name: 'Cabillaud alla Putanesca',
  description:
    "Potter ipsum wand elf parchment wingardium. Umbridge mischief hoops sorcerer's winky. Peruvian-night-powder...",
  // Placeholder image URL - will be replaced with real recipe images from API
  imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
}

export function RecipeOfTheDay(): React.ReactElement {
  const { t } = useTranslation()

  const handlePress = (): void => {
    // TODO: Navigate to recipe detail or open URL
  }

  return (
    <View className="py-2">
      <SectionHeader icon={UtensilsCrossed} title={t('dashboard.recipe.title')} />

      <View className="px-4">
        <ImageBackground
          source={{ uri: PLACEHOLDER_RECIPE.imageUrl }}
          className="h-56 rounded-xl overflow-hidden justify-end"
          imageStyle={{ borderRadius: 20 }}
          resizeMode="cover"
        >
          {/* Dark overlay gradient */}
          <View className="absolute inset-0 bg-black/35 rounded-xl" />

          {/* Content */}
          <View className="p-4 gap-3">
            <View className="gap-1">
              <Text className="text-xl font-bold text-surface">{PLACEHOLDER_RECIPE.name}</Text>
              <Text className="text-sm text-surface opacity-90 leading-5" numberOfLines={2}>
                {PLACEHOLDER_RECIPE.description}
              </Text>
            </View>

            {/* Discover button */}
            <View className="self-end">
              <Button
                title={t('dashboard.recipe.discover')}
                variant="secondary"
                iconRight={ChevronRight}
                fitContent
                haptic="light"
                onPress={handlePress}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  )
}
