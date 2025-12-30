import { ChevronRight } from 'lucide-react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { ProductDetailSheet } from '@features/routine/components/ProductDetailSheet'
import type { ProductDto, RoutineStepWithProducts } from '@features/routine/types/routine.types'
import { CATEGORY_LABELS } from '@features/routine/types/routine.types'
import { Pressable } from '@shared/components/Pressable'
import { haptic } from '@shared/utils/haptic'
import { colors } from '@theme/colors'

interface ProductItemProps {
  product: ProductDto
  isLast: boolean
  onPress: () => void
}

function ProductItem({ product, isLast, onPress }: ProductItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center ${!isLast ? 'mb-3 pb-3 border-b border-border/50' : ''}`}
    >
      {product.illustrationUrl && (
        <Image
          source={{ uri: product.illustrationUrl }}
          className="w-20 h-20 rounded-lg mr-4 bg-background"
          resizeMode="cover"
        />
      )}

      <View className="flex-1 justify-center">
        <Text className="text-base font-bold text-text mb-1" numberOfLines={2}>
          {product.name}
        </Text>
        {product.brand && <Text className="text-sm text-textMuted">{product.brand}</Text>}
      </View>

      <ChevronRight size={18} color={colors.textLight} />
    </Pressable>
  )
}

interface RoutineStepCardProps {
  stepWithProducts: RoutineStepWithProducts
  index: number
  categoryOccurrence: number
  totalCategoryCount: number
}

export function RoutineStepCard({
  stepWithProducts,
  index,
  categoryOccurrence,
  totalCategoryCount,
}: RoutineStepCardProps) {
  const { t } = useTranslation()
  const { step, products } = stepWithProducts
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null)

  const baseLabel = CATEGORY_LABELS[step.category] || step.category
  const categoryLabel =
    totalCategoryCount > 1
      ? `${t(categoryOccurrence === 1 ? 'routine.ordinal.first' : 'routine.ordinal.second')} ${baseLabel.toLowerCase()}`
      : baseLabel
  const hasProducts = products.length > 0

  const handleProductPress = (product: ProductDto) => {
    haptic.light()
    setSelectedProduct(product)
  }

  const handleCloseSheet = () => {
    setSelectedProduct(null)
  }

  return (
    <>
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        className="bg-surface rounded-2xl p-4 mb-4 border border-border"
      >
        {/* Step Header */}
        <View className="flex-row items-center mb-3">
          <View className="bg-primary w-7 h-7 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold text-sm">{step.order}</Text>
          </View>
          <Text className="text-base font-semibold text-text">{categoryLabel}</Text>
          {products.length > 1 && (
            <View className="ml-2 px-2 py-0.5 rounded-full bg-primary/10">
              <Text className="text-xs font-semibold text-primary">{products.length}</Text>
            </View>
          )}
        </View>

        {/* Products */}
        {hasProducts ? (
          <>
            <View className="mb-3">
              {products.map((product, productIndex) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  isLast={productIndex === products.length - 1}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          </>
        ) : (
          <View className="py-4 items-center">
            <Text className="text-textMuted text-sm">{t('routine.noProductForStep')}</Text>
          </View>
        )}
      </Animated.View>

      <ProductDetailSheet
        product={selectedProduct}
        visible={selectedProduct !== null}
        onClose={handleCloseSheet}
      />
    </>
  )
}
