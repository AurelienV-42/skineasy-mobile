import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { Card } from '@shared/components/card';
import { Pressable } from '@shared/components/pressable';
import { cn } from '@shared/utils/cn';
import { haptic } from '@shared/utils/haptic';
import { colors } from '@theme/colors';

const SPRING_CONFIG = { damping: 20, stiffness: 300 };

function animateCardTap(scale: SharedValue<number>): void {
  scale.value = withSequence(withTiming(0.97, { duration: 60 }), withSpring(1, SPRING_CONFIG));
}

export function AnswerCard({
  label,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onPress: () => void;
}): React.ReactElement {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = (): void => {
    animateCardTap(scale);
    haptic.selection();
    onPress();
  };

  const iconColor = selected ? colors.surface : colors.primary;

  return (
    <Animated.View style={cardStyle}>
      <Pressable onPress={handlePress} haptic={false}>
        <Card isPressed={selected}>
          <View className="flex-row items-center gap-3">
            <Icon size={22} color={iconColor} strokeWidth={1.75} />
            <Text className={cn('text-xl flex-1', selected ? 'text-white' : 'text-text')}>
              {label}
            </Text>
            {selected && <Check size={22} color={colors.surface} strokeWidth={2.5} />}
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
