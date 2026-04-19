import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

import { colors } from '@theme/colors';

export const TOTAL_STEPS = 3;

function AnimatedSegment({ filled }: { filled: boolean }): React.ReactElement {
  const progress = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(filled ? 1 : 0, { duration: 300 });
  }, [filled, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      className="flex-1 h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: colors.border }}
    >
      <Animated.View style={[fillStyle, { height: '100%', backgroundColor: colors.primary }]} />
    </View>
  );
}

export function StepProgressBar({ step }: { step: number }): React.ReactElement {
  return (
    <View className="flex-row gap-1.5 flex-1 ml-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <AnimatedSegment key={i} filled={step > i} />
      ))}
    </View>
  );
}
