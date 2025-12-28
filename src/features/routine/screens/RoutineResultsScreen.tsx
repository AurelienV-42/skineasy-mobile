import { useLocalSearchParams } from 'expo-router'
import { Clock, ExternalLink, ShoppingCart } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Linking, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { useRoutineByRspid } from '@features/routine/hooks/useRoutineByRspid'
import { Pressable } from '@shared/components/Pressable'
import { ScreenHeader } from '@shared/components/ScreenHeader'
import type { RoutineProduct } from '@shared/types/routine.types'
import { haptic } from '@shared/utils/haptic'
import { colors } from '@theme/colors'

function ProductCard({ product, index }: { product: RoutineProduct; index: number }) {
  const { t } = useTranslation()

  const handleShopPress = () => {
    if (product.purchaseUrl) {
      haptic.medium()
      Linking.openURL(product.purchaseUrl)
    }
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-surface rounded-2xl p-4 mb-4 shadow-sm"
    >
      <View className="flex-row">
        {/* Product Image */}
        {product.imageUrl && (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="cover"
          />
        )}

        {/* Product Info */}
        <View className="flex-1">
          <Text className="text-xs text-primary font-medium mb-1">{product.step}</Text>
          <Text className="text-base font-bold text-text mb-1">{product.name}</Text>
          <Text className="text-sm text-textMuted mb-2">{product.brand}</Text>
          <Text className="text-base font-semibold text-primary">
            {product.price.toFixed(2)} {product.currency === 'EUR' ? '€' : product.currency}
          </Text>
        </View>
      </View>

      {/* Shop Button */}
      {product.purchaseUrl && (
        <Pressable
          onPress={handleShopPress}
          haptic="medium"
          className="mt-4 bg-primary rounded-xl py-3 flex-row items-center justify-center"
        >
          <ShoppingCart size={18} color={colors.surface} />
          <Text className="text-white font-semibold ml-2">{t('routine.shopProduct')}</Text>
          <ExternalLink size={14} color={colors.surface} className="ml-1" />
        </Pressable>
      )}
    </Animated.View>
  )
}

function ProcessingState() {
  const { t } = useTranslation()

  return (
    <View className="flex-1 items-center justify-center px-4">
      <View className="bg-primary/10 rounded-full p-6 mb-6">
        <Clock size={48} color={colors.primary} />
      </View>
      <Text className="text-xl font-bold text-text text-center mb-2">
        {t('routine.processingTitle')}
      </Text>
      <Text className="text-base text-textMuted text-center">{t('routine.processingMessage')}</Text>
      <ActivityIndicator size="large" color={colors.primary} className="mt-8" />
    </View>
  )
}

export default function RoutineResultsScreen() {
  const { t } = useTranslation()
  const { rspid } = useLocalSearchParams<{ rspid: string }>()

  const { data, isLoading, isError } = useRoutineByRspid(rspid || null)

  const isProcessing = data?.status === 'processing'
  const products = data?.products || []

  // Loading state
  if (isLoading) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenHeader>
    )
  }

  // Error state
  if (isError) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text text-center mb-2">
            {t('common.error')}
          </Text>
          <Text className="text-base text-textMuted text-center">{t('routine.loadError')}</Text>
        </View>
      </ScreenHeader>
    )
  }

  // Processing state
  if (isProcessing) {
    return (
      <ScreenHeader title={t('routine.resultsTitle')}>
        <ProcessingState />
      </ScreenHeader>
    )
  }

  // Ready state with products
  return (
    <ScreenHeader title={t('routine.resultsTitle')}>
      {/* Title */}
      <Animated.View entering={FadeInDown.springify()} className="mb-6">
        <Text className="text-2xl font-bold text-text mb-2">{t('routine.readyTitle')}</Text>
        <Text className="text-base text-textMuted">{t('routine.readySubtitle')}</Text>
      </Animated.View>

      {/* Products */}
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}

      {/* Empty state */}
      {products.length === 0 && (
        <View className="items-center py-8">
          <Text className="text-textMuted">{t('routine.noProducts')}</Text>
        </View>
      )}
    </ScreenHeader>
  )
}
