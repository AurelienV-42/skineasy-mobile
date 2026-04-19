import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { DEMO_QUESTIONS } from '@features/questionnaire-demo/constants';
import { AnswerCard } from '@features/questionnaire-demo/components/answer-card';

function isSelected(value: string, selected: string | string[] | null): boolean {
  if (Array.isArray(selected)) return selected.includes(value);
  return value === selected;
}

export function QuestionCard({
  step,
  selected,
  onSelect,
}: {
  step: number;
  selected: string | string[] | null;
  onSelect: (value: string) => void;
}): React.ReactElement {
  const { t } = useTranslation();
  const question = DEMO_QUESTIONS[step];
  if (!question) return <View className="flex-1" />;

  return (
    <View className="flex-1 gap-3 pt-4">
      <Text className="text-4xl font-bold text-primary text-center mb-4">
        {t(question.titleKey)}
      </Text>
      {question.options.map((opt) => (
        <AnswerCard
          key={opt.value}
          label={t(opt.labelKey)}
          icon={opt.icon}
          selected={isSelected(opt.value, selected)}
          onPress={() => onSelect(opt.value)}
        />
      ))}
    </View>
  );
}
