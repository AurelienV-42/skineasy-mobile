import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable } from '@shared/components/pressable';
import { colors } from '@theme/colors';

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

export function QuestionnaireDemoScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<DemoStep>(0);
  const [_answers, _setAnswers] = useState<DemoAnswers>(INITIAL_ANSWERS);

  const _advance = (): void => setStep((s) => Math.min(s + 1, 3) as DemoStep);
  const _goBack = (): void => setStep((s) => Math.max(s - 1, 0) as DemoStep);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <Pressable onPress={() => router.back()} haptic="light">
          <X size={24} color={colors.text} />
        </Pressable>
        <View className="flex-1" />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-text text-center">
          {t('questionnaireDemo.title')}
        </Text>
        <Text className="text-sm text-textMuted mt-2">{`Step ${step}`}</Text>
      </View>
    </SafeAreaView>
  );
}
