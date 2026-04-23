import { Baby, ChevronRight, Droplets } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AllProductsSheet } from '@features/routine/components/AllProductsSheet';
import type {
  ProductSelectionDto,
  RoutineSummaryDto,
  SkinAnalysisDto,
} from '@features/routine/types/routine.types';
import { Pressable } from '@shared/components/pressable';
import { colors } from '@theme/colors';

interface RoutineSummaryCardProps {
  summary: RoutineSummaryDto;
  analysis: SkinAnalysisDto;
  productSelection: ProductSelectionDto;
}

export function RoutineSummaryCard({
  summary,
  analysis,
  productSelection,
}: RoutineSummaryCardProps) {
  const { t } = useTranslation();
  const [showAllSheet, setShowAllSheet] = useState(false);

  const concerns = summary.primaryConcerns.join(' · ');
  const isPregnancySafe = analysis.healthConditions.isPregnancySafe;
  const hasProducts = summary.totalProducts > 0;

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className="bg-primary/5 rounded-2xl p-4 mb-4 border border-primary/20"
    >
      {/* Skin Type Header */}
      <View className="flex-row items-center mb-2">
        <View className="bg-primary/10 rounded-full p-2 mr-3">
          <Droplets size={20} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-text">{summary.skinTypeLabel}</Text>
          {concerns && <Text className="text-sm text-textMuted">{concerns}</Text>}
        </View>
        {isPregnancySafe && (
          <View className="flex-row items-center bg-success/10 rounded-full px-2 py-1">
            <Baby size={14} color={colors.success} />
            <Text className="text-xs text-success font-medium ml-1">
              {t('routine.summary.pregnancySafe')}
            </Text>
          </View>
        )}
      </View>

      {hasProducts && (
        <Pressable
          onPress={() => setShowAllSheet(true)}
          haptic="light"
          className="flex-row items-center justify-between mt-3 pt-3 border-t border-primary/10"
          accessibilityLabel={t('routine.summary.viewProducts')}
        >
          <Text className="text-sm font-medium text-primary">
            {t('routine.summary.viewProducts')} ({summary.totalProducts})
          </Text>
          <ChevronRight size={18} color={colors.primary} />
        </Pressable>
      )}

      <AllProductsSheet
        visible={showAllSheet}
        onClose={() => setShowAllSheet(false)}
        allProducts={productSelection.products}
      />
    </Animated.View>
  );
}
