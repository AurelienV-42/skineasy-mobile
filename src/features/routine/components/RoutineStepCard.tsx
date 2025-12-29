import { Lightbulb } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import type { ProductDto, RoutineStepWithProducts } from '@features/routine/types/routine.types'
import { CATEGORY_LABELS } from '@features/routine/types/routine.types'
import { colors } from '@theme/colors'

interface ProductItemProps {
  product: ProductDto
  isLast: boolean
}

/**
 * Individual product display within a step
 */
function ProductItem({ product, isLast }: ProductItemProps) {
  return (
    <View className={`flex-row ${!isLast ? 'mb-3 pb-3 border-b border-border/50' : ''}`}>
      {/* Product Image */}
      {product.illustrationUrl && (
        <Image
          source={{ uri: product.illustrationUrl }}
          className="w-20 h-20 rounded-lg mr-4 bg-background"
          resizeMode="cover"
        />
      )}

      {/* Product Details */}
      <View className="flex-1 justify-center">
        <Text className="text-base font-bold text-text mb-1" numberOfLines={2}>
          {product.name}
        </Text>
        {product.brand && <Text className="text-sm text-textMuted">{product.brand}</Text>}
      </View>
    </View>
  )
}

interface RoutineStepCardProps {
  stepWithProducts: RoutineStepWithProducts
  index: number
}

export function RoutineStepCard({ stepWithProducts, index }: RoutineStepCardProps) {
  const { t } = useTranslation()
  const { step, products } = stepWithProducts

  const categoryLabel = CATEGORY_LABELS[step.category] || step.category
  const hasProducts = products.length > 0

  return (
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
              />
            ))}
          </View>

          {/* Instructions */}
          {step.instructions && (
            <View className="bg-primary/5 rounded-xl p-3 flex-row">
              <Lightbulb size={18} color={colors.primary} className="mr-2 mt-0.5" />
              <Text className="text-sm text-text flex-1 ml-2">{step.instructions}</Text>
            </View>
          )}
        </>
      ) : (
        /* No products found for this step */
        <View className="py-4 items-center">
          <Text className="text-textMuted text-sm">{t('routine.noProductForStep')}</Text>
        </View>
      )}
    </Animated.View>
  )
}
