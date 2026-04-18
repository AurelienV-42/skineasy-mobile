import { Text, View } from 'react-native';
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
import { DEMO_QUESTIONS } from '@features/questionnaire-demo/constants';

const SPRING_CONFIG = { damping: 20, stiffness: 300 };

function animateCardTap(scale: SharedValue<number>): void {
  scale.value = withSequence(withTiming(0.97, { duration: 60 }), withSpring(1, SPRING_CONFIG));
}

function TappableCard({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = (): void => {
    animateCardTap(scale);
    haptic.selection();
    onPress();
  };

  return (
    <Animated.View style={cardStyle}>
      <Pressable onPress={handlePress} haptic={false}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function QuestionCard({
  step,
  selected,
}: {
  step: number;
  selected: string | null;
}): React.ReactElement {
  const question = DEMO_QUESTIONS[step];
  if (!question) return <View className="flex-1" />;

  return (
    <View className="flex-1 gap-3 pt-4">
      <Text className="text-4xl font-bold text-primary text-center mb-4">{question.title}</Text>
      {question.options.map((opt) => (
        <TappableCard key={opt.value} onPress={() => {}}>
          <Card isPressed={opt.value === selected}>
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">{opt.emoji}</Text>
              <Text
                className={cn(
                  'text-xl flex-1',
                  opt.value === selected ? 'text-white' : 'text-text',
                )}
              >
                {opt.label}
              </Text>
            </View>
          </Card>
        </TappableCard>
      ))}
    </View>
  );
}
