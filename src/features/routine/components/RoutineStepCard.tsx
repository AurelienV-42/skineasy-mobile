import { Lightbulb } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { CATEGORY_LABELS, type RoutineStepWithProduct } from '@features/routine/types/routine.types'
import { colors } from '@theme/colors'

interface RoutineStepCardProps {
  stepWithProduct: RoutineStepWithProduct
  index: number
}

export function RoutineStepCard({ stepWithProduct, index }: RoutineStepCardProps) {
  const { t } = useTranslation()
  const { step, product } = stepWithProduct

  const categoryLabel = CATEGORY_LABELS[step.category] || step.category

  console.log('Product', product?.illustrationUrl, product)
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
      </View>

      {/* Product Info */}
      {product ? (
        <>
          <View className="flex-row mb-3">
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

          {/* Instructions */}
          {step.instructions && (
            <View className="bg-primary/5 rounded-xl p-3 flex-row">
              <Lightbulb size={18} color={colors.primary} className="mr-2 mt-0.5" />
              <Text className="text-sm text-text flex-1 ml-2">{step.instructions}</Text>
            </View>
          )}
        </>
      ) : (
        /* No product found for this step */
        <View className="py-4 items-center">
          <Text className="text-textMuted text-sm">{t('routine.noProductForStep')}</Text>
        </View>
      )}
    </Animated.View>
  )
}
