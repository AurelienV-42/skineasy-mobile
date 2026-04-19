import { useAnimatedStyle } from 'react-native-reanimated';

import { useTabBarContext } from '@shared/contexts/TabBarContext';

import { BAR_HEIGHT, BUBBLE_INSET_Y, BUBBLE_PADDING_X, FAB_NOTCH_WIDTH } from './constants';

type UseBubbleStyleResult = {
  bubbleWidth: number;
  bubbleHeight: number;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
};

export function useBubbleStyle(
  containerWidth: number,
  leftCount: number,
  rightCount: number,
): UseBubbleStyleResult {
  const { activeIndex } = useTabBarContext();
  const groupWidth = (containerWidth - FAB_NOTCH_WIDTH) / 2;
  const leftTabWidth = groupWidth / leftCount;
  const rightTabWidth = groupWidth / rightCount;
  const cellWidth = Math.min(leftTabWidth, rightTabWidth);
  const bubbleWidth = cellWidth - BUBBLE_PADDING_X * 2;
  const bubbleHeight = BAR_HEIGHT - BUBBLE_INSET_Y * 2;

  const animatedStyle = useAnimatedStyle(() => {
    const idx = activeIndex.value;
    const lastLeftCenter = leftTabWidth * (leftCount - 0.5);
    const firstRightCenter = groupWidth + FAB_NOTCH_WIDTH + rightTabWidth * 0.5;

    let centerX: number;
    if (idx <= leftCount - 1) {
      centerX = leftTabWidth * (idx + 0.5);
    } else if (idx >= leftCount) {
      centerX = groupWidth + FAB_NOTCH_WIDTH + rightTabWidth * (idx - leftCount + 0.5);
    } else {
      const t = idx - (leftCount - 1);
      centerX = lastLeftCenter + (firstRightCenter - lastLeftCenter) * t;
    }

    return {
      transform: [{ translateX: centerX - bubbleWidth / 2 }],
      width: bubbleWidth,
      height: bubbleHeight,
    };
  });

  return { bubbleWidth, bubbleHeight, animatedStyle };
}
