import { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from '@shared/components/styled-rn';

import { Button } from '@shared/components/button';
import { Pressable } from '@shared/components/pressable';
import { haptic } from '@shared/utils/haptic';
import { toast } from '@lib/toast';
import { colors } from '@theme/colors';
import { CompletionScreen } from '@features/questionnaire-demo/components/completion-screen';
import { QuestionCard } from '@features/questionnaire-demo/components/question-card';
import { StepProgressBar } from '@features/questionnaire-demo/components/progress-bar';
import { X } from 'lucide-react-native';
import {
  useDemoState,
  type DemoStep,
  type DemoAnswers,
} from '@features/questionnaire-demo/hooks/use-demo-state';

const ADVANCE_DELAY_MS = 220;

function getSelected(step: DemoStep, answers: DemoAnswers): string | string[] | null {
  if (step === 0) return answers.skinType;
  if (step === 1) return answers.concerns;
  if (step === 2) return answers.ageRange;
  return null;
}

export function QuestionnaireDemoScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useTranslation();
  const { step, setStep, answers, setAnswer, canAdvance } = useDemoState();
  const [advancing, setAdvancing] = useState(false);
  const isMultiSelect = useMemo(() => Array.isArray(getSelected(step, answers)), [step, answers]);

  const goNext = (fromStep: DemoStep): void => {
    const next = Math.min(fromStep + 1, 3) as DemoStep;
    setStep(next);
    setAdvancing(false);
  };

  const goBack = (): void => {
    if (step === 0) {
      router.back();
      return;
    }
    const prev = Math.max(step - 1, 0) as DemoStep;
    setStep(prev);
  };

  const handleSelect = (value: string): void => {
    if (advancing) return;
    setAnswer(value);
    if (isMultiSelect) return;
    setAdvancing(true);
    setTimeout(() => goNext(step), ADVANCE_DELAY_MS);
  };

  const handleNext = (): void => {
    if (advancing || !canAdvance) return;
    setAdvancing(true);
    setTimeout(() => goNext(step), ADVANCE_DELAY_MS);
  };

  const handleCompletion = (): void => {
    haptic.success();
    if (__DEV__) toast.success('Démo terminée', undefined, { haptic: false });
    setTimeout(() => router.back(), 1500);
  };

  return (
    <LinearGradient colors={[colors.surface, colors.creamMuted]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <Pressable onPress={() => router.back()} haptic="light">
            <X size={24} color={colors.text} />
          </Pressable>
          <StepProgressBar step={step} />
        </View>

        {step === 3 ? (
          <CompletionScreen onBack={handleCompletion} />
        ) : (
          <>
            <View className="flex-1 px-6 pt-4">
              <Animated.View
                key={step}
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(150)}
                style={{ flex: 1 }}
              >
                <QuestionCard
                  step={step}
                  selected={getSelected(step, answers)}
                  onSelect={handleSelect}
                />
              </Animated.View>
            </View>
            <View className="px-6 pb-6 pt-4 gap-3">
              {isMultiSelect && (
                <Button
                  title={t('questionnaireDemo.next')}
                  onPress={handleNext}
                  haptic="medium"
                  disabled={!canAdvance}
                />
              )}
              {step > 0 && (
                <Button
                  title={t('questionnaireDemo.back')}
                  onPress={goBack}
                  haptic="light"
                  variant="secondary"
                />
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
