export type AnswerOption = {
  value: string;
  label: string;
  emoji: string;
};

export type DemoQuestion = {
  title: string;
  options: AnswerOption[];
};

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    title: 'Type de peau ressenti',
    options: [
      { value: 'very-dry', label: 'Très sèche', emoji: '🌵' },
      { value: 'dry', label: 'Sèche', emoji: '🌸' },
      { value: 'normal', label: 'Normale', emoji: '✨' },
      { value: 'mixed', label: 'Mixte', emoji: '🌊' },
      { value: 'oily', label: 'Grasse', emoji: '🍃' },
    ],
  },
  {
    title: 'Tes préoccupations principales',
    options: [
      { value: 'imperfections', label: 'Imperfections', emoji: '😔' },
      { value: 'wrinkles', label: 'Rides', emoji: '😌' },
      { value: 'sensitivity', label: 'Sensibilité', emoji: '🌼' },
      { value: 'spots', label: 'Taches', emoji: '☀️' },
      { value: 'blackheads', label: 'Points noirs', emoji: '🔵' },
      { value: 'glow', label: 'Éclat', emoji: '💎' },
    ],
  },
  {
    title: 'Ton âge',
    options: [
      { value: 'under-20', label: '< 20', emoji: '🌱' },
      { value: '20-29', label: '20–29', emoji: '🌿' },
      { value: '30-39', label: '30–39', emoji: '🌳' },
      { value: '40-49', label: '40–49', emoji: '🍂' },
      { value: '50+', label: '50+', emoji: '🌟' },
    ],
  },
];
