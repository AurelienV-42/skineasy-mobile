import { type LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@theme/colors';

interface RecommendationPillProps {
  icon: LucideIcon;
  label: string;
}

export function RecommendationPill({
  icon: Icon,
  label,
}: RecommendationPillProps): React.ReactElement {
  return (
    <View className="flex-row items-center gap-2 bg-white rounded-full px-3 py-2">
      <Icon size={16} color={colors.brownDark} strokeWidth={2} />
      <Text className="text-brown-dark text-sm font-medium">{label}</Text>
    </View>
  );
}
