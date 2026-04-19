import { BookOpen, Home, Sparkles, User } from 'lucide-react-native';

export type TabConfig = {
  name: string;
  href: string;
  labelKey: string;
  icon: typeof Home;
};

export const BASE_TABS: TabConfig[] = [
  { name: 'index', href: '/', labelKey: 'dashboard.home', icon: Home },
  { name: 'journal', href: '/journal', labelKey: 'journal.title', icon: BookOpen },
];

export const ROUTINE_TABS: TabConfig[] = [
  { name: 'routine', href: '/routine', labelKey: 'routine.title', icon: Sparkles },
  { name: 'profile', href: '/profile', labelKey: 'profile.title', icon: User },
];
