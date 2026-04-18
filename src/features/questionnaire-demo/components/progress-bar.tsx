import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors } from '@theme/colors';

export const TOTAL_STEPS = 3;

const SPRING_CONFIG = { damping: 20, stiffness: 300 };

function AnimatedSegment({ filled }: { filled: boolean }): React.ReactElement {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useSharedValue(-200);

  useEffect(() => {
    if (trackWidth === 0) return;
    translateX.value = withSpring(filled ? 0 : -trackWidth, SPRING_CONFIG);
  }, [filled, trackWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="flex-1 h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: colors.border }}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[fillStyle, { flex: 1, backgroundColor: colors.primary }]} />
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
