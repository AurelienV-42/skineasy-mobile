import { Eye, EyeOff, Package } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';

import { useHiddenProductsStore } from '@features/routine/stores/hiddenProductsStore';
import type {
  ProductCategory,
  ProductDto,
  ProductSelectionProducts,
} from '@features/routine/types/routine.types';
import { CATEGORY_LABELS } from '@features/routine/types/routine.types';
import { BottomSheet } from '@shared/components/bottom-sheet';
import { Pressable } from '@shared/components/pressable';
import { cn } from '@shared/utils/cn';
import { haptic } from '@shared/utils/haptic';
import { colors } from '@theme/colors';

interface AllProductsSheetProps {
  visible: boolean;
  onClose: () => void;
  allProducts: ProductSelectionProducts;
}

interface ProductWithCategory {
  product: ProductDto;
  category: ProductCategory;
}

export function AllProductsSheet({
  visible,
  onClose,
  allProducts,
}: AllProductsSheetProps): React.ReactElement {
  const { t } = useTranslation();
  const hiddenIds = useHiddenProductsStore((s) => s.hiddenIds);
  const hideProduct = useHiddenProductsStore((s) => s.hideProduct);
  const unhideProduct = useHiddenProductsStore((s) => s.unhideProduct);

  const products = useMemo<ProductWithCategory[]>(() => {
    const result: ProductWithCategory[] = [];
    (Object.keys(allProducts) as ProductCategory[]).forEach((category) => {
      allProducts[category].forEach((product) => {
        result.push({ product, category });
      });
    });
    return result;
  }, [allProducts]);

  const handleToggle = (productId: string, isHidden: boolean): void => {
    haptic.medium();
    if (isHidden) {
      unhideProduct(productId);
    } else {
      hideProduct(productId);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} scrollable backgroundColor={colors.surface}>
      <ScrollView className="pt-10 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-text mb-4">
          {t('routine.summary.viewProducts')} ({products.length})
        </Text>

        {products.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-textMuted text-sm">{t('routine.noProducts')}</Text>
          </View>
        ) : (
          products.map(({ product, category }) => {
            const isHidden = !!hiddenIds[product.id];
            return (
              <View
                key={product.id}
                className={cn(
                  'flex-row items-center mb-3 pb-3 border-b border-border/50',
                  isHidden && 'opacity-50',
                )}
              >
                {product.illustrationUrl ? (
                  <Image
                    source={{ uri: product.illustrationUrl }}
                    className="w-16 h-16 rounded-lg mr-3 bg-background"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-lg mr-3 bg-background items-center justify-center">
                    <Package size={20} color={colors.textMuted} />
                  </View>
                )}
                <View className="flex-1 pr-2">
                  <Text className="text-sm font-semibold text-text" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className="text-xs text-primary mt-0.5">
                    {CATEGORY_LABELS[category] || category}
                  </Text>
                  {product.brand && (
                    <Text className="text-xs text-textMuted mt-0.5" numberOfLines={1}>
                      {product.brand}
                    </Text>
                  )}
                </View>
                <Pressable
                  onPress={() => handleToggle(product.id, isHidden)}
                  hitSlop={12}
                  className="p-2"
                  accessibilityLabel={
                    isHidden ? t('routine.hiddenProducts.restore') : t('routine.productDetail.hide')
                  }
                >
                  {isHidden ? (
                    <EyeOff size={20} color={colors.textMuted} />
                  ) : (
                    <Eye size={20} color={colors.primary} />
                  )}
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </BottomSheet>
  );
}
