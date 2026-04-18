export type AnswerOption = {
  value: string;
  labelKey: string;
  emoji: string;
};

export type DemoQuestion = {
  titleKey: string;
  options: AnswerOption[];
};

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    titleKey: 'questionnaireDemo.q1Title',
    options: [
      { value: 'very-dry', labelKey: 'questionnaireDemo.q1VeryDry', emoji: '🌵' },
      { value: 'dry', labelKey: 'questionnaireDemo.q1Dry', emoji: '🌸' },
      { value: 'normal', labelKey: 'questionnaireDemo.q1Normal', emoji: '✨' },
      { value: 'mixed', labelKey: 'questionnaireDemo.q1Mixed', emoji: '🌊' },
      { value: 'oily', labelKey: 'questionnaireDemo.q1Oily', emoji: '🍃' },
    ],
  },
  {
    titleKey: 'questionnaireDemo.q2Title',
    options: [
      { value: 'imperfections', labelKey: 'questionnaireDemo.q2Imperfections', emoji: '😔' },
      { value: 'wrinkles', labelKey: 'questionnaireDemo.q2Wrinkles', emoji: '😌' },
      { value: 'sensitivity', labelKey: 'questionnaireDemo.q2Sensitivity', emoji: '🌼' },
      { value: 'spots', labelKey: 'questionnaireDemo.q2Spots', emoji: '☀️' },
      { value: 'blackheads', labelKey: 'questionnaireDemo.q2Blackheads', emoji: '🔵' },
      { value: 'glow', labelKey: 'questionnaireDemo.q2Glow', emoji: '💎' },
    ],
  },
  {
    titleKey: 'questionnaireDemo.q3Title',
    options: [
      { value: 'under-20', labelKey: 'questionnaireDemo.q3Under20', emoji: '🌱' },
      { value: '20-29', labelKey: 'questionnaireDemo.q3Range2029', emoji: '🌿' },
      { value: '30-39', labelKey: 'questionnaireDemo.q3Range3039', emoji: '🌳' },
      { value: '40-49', labelKey: 'questionnaireDemo.q3Range4049', emoji: '🍂' },
      { value: '50+', labelKey: 'questionnaireDemo.q3Range50plus', emoji: '🌟' },
    ],
  },
];
