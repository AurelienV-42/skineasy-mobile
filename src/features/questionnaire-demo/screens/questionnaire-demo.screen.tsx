import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@shared/components/button';
import { Pressable } from '@shared/components/pressable';
import { haptic } from '@shared/utils/haptic';
import { colors } from '@theme/colors';

const TOTAL_STEPS = 3;
const SPRING_CONFIG = { damping: 20, stiffness: 300 };

type DemoStep = 0 | 1 | 2 | 3;

type DemoAnswers = {
  skinType: string | null;
  concerns: string[];
  ageRange: string | null;
};

const INITIAL_ANSWERS: DemoAnswers = {
  skinType: null,
  concerns: [],
  ageRange: null,
};

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

function StepProgressBar({ step }: { step: DemoStep }): React.ReactElement {
  return (
    <View className="flex-row gap-1.5 flex-1 ml-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <AnimatedSegment key={i} filled={step > i} />
      ))}
    </View>
  );
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
    haptic.light();
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

function QuestionCard({ step }: { step: DemoStep }): React.ReactElement {
  return (
    <View className="flex-1 gap-3 pt-4">
      <Text className="text-base font-medium text-textMuted text-center mb-2">
        {`Q${step + 1}`}
      </Text>
      {['Option A', 'Option B', 'Option C'].map((opt) => (
        <TappableCard key={opt} onPress={() => {}}>
          <View
            className="p-4 rounded-xl bg-surface"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="text-base text-text">{opt}</Text>
          </View>
        </TappableCard>
      ))}
    </View>
  );
}

function animateCardTap(scale: SharedValue<number>): void {
  scale.value = withSequence(withTiming(0.97, { duration: 60 }), withSpring(1, SPRING_CONFIG));
}

function hasAnswer(step: DemoStep, answers: DemoAnswers): boolean {
  if (step === 0) return answers.skinType !== null;
  if (step === 1) return answers.concerns.length > 0;
  if (step === 2) return answers.ageRange !== null;
  return false;
}

function runStepTransition(
  tx: SharedValue<number>,
  opacity: SharedValue<number>,
  setVisible: (s: DemoStep) => void,
  next: DemoStep,
  dir: 'forward' | 'backward',
): void {
  const exitX = dir === 'forward' ? -30 : 30;
  const enterX = dir === 'forward' ? 30 : -30;
  opacity.value = withSpring(0, SPRING_CONFIG);
  tx.value = withSpring(exitX, SPRING_CONFIG, () => {
    tx.value = enterX;
    opacity.value = 0;
    runOnJS(setVisible)(next);
    tx.value = withSpring(0, SPRING_CONFIG);
    opacity.value = withSpring(1, SPRING_CONFIG);
  });
}

export function QuestionnaireDemoScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<DemoStep>(0);
  const [visibleStep, setVisibleStep] = useState<DemoStep>(0);
  const [answers, _setAnswers] = useState<DemoAnswers>(INITIAL_ANSWERS);
  const tx = useSharedValue(0);
  const opacity = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
    opacity: opacity.value,
  }));

  const advance = (): void => {
    const next = Math.min(step + 1, 3) as DemoStep;
    setStep(next);
    runStepTransition(tx, opacity, setVisibleStep, next, 'forward');
  };
  const goBack = (): void => {
    const next = Math.max(step - 1, 0) as DemoStep;
    setStep(next);
    runStepTransition(tx, opacity, setVisibleStep, next, 'backward');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <Pressable onPress={() => router.back()} haptic="light">
          <X size={24} color={colors.text} />
        </Pressable>
        {step > 0 && (
          <Pressable onPress={goBack} haptic="light" className="ml-2">
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
        )}
        <StepProgressBar step={step} />
      </View>

      <View className="flex-1 px-6 pt-4">
        <Animated.View style={[cardStyle, { flex: 1 }]}>
          <QuestionCard step={visibleStep} />
        </Animated.View>
      </View>

      <View className="px-6 pb-6 pt-4">
        <Button
          title={t('questionnaireDemo.next')}
          onPress={advance}
          disabled={!hasAnswer(step, answers)}
          haptic="medium"
        />
      </View>
    </SafeAreaView>
  );
}
