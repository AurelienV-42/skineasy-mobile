import {
  Blend,
  Calendar,
  CircleDot,
  Droplet,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Sparkles,
  Sprout,
  Star,
  Sun,
  TreeDeciduous,
  TreePine,
  Waves,
  type LucideIcon,
} from 'lucide-react-native';

export type AnswerOption = {
  value: string;
  labelKey: string;
  icon: LucideIcon;
};

export type DemoQuestion = {
  titleKey: string;
  options: AnswerOption[];
};

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    titleKey: 'questionnaireDemo.q1Title',
    options: [
      { value: 'very-dry', labelKey: 'questionnaireDemo.q1VeryDry', icon: Flame },
      { value: 'dry', labelKey: 'questionnaireDemo.q1Dry', icon: Droplet },
      { value: 'normal', labelKey: 'questionnaireDemo.q1Normal', icon: Sparkles },
      { value: 'mixed', labelKey: 'questionnaireDemo.q1Mixed', icon: Blend },
      { value: 'oily', labelKey: 'questionnaireDemo.q1Oily', icon: Droplets },
    ],
  },
  {
    titleKey: 'questionnaireDemo.q2Title',
    options: [
      { value: 'imperfections', labelKey: 'questionnaireDemo.q2Imperfections', icon: CircleDot },
      { value: 'wrinkles', labelKey: 'questionnaireDemo.q2Wrinkles', icon: Waves },
      { value: 'sensitivity', labelKey: 'questionnaireDemo.q2Sensitivity', icon: Heart },
      { value: 'spots', labelKey: 'questionnaireDemo.q2Spots', icon: Sun },
      { value: 'blackheads', labelKey: 'questionnaireDemo.q2Blackheads', icon: Calendar },
      { value: 'glow', labelKey: 'questionnaireDemo.q2Glow', icon: Star },
    ],
  },
  {
    titleKey: 'questionnaireDemo.q3Title',
    options: [
      { value: 'under-20', labelKey: 'questionnaireDemo.q3Under20', icon: Sprout },
      { value: '20-29', labelKey: 'questionnaireDemo.q3Range2029', icon: Leaf },
      { value: '30-39', labelKey: 'questionnaireDemo.q3Range3039', icon: TreeDeciduous },
      { value: '40-49', labelKey: 'questionnaireDemo.q3Range4049', icon: TreePine },
      { value: '50+', labelKey: 'questionnaireDemo.q3Range50plus', icon: Star },
    ],
  },
];
