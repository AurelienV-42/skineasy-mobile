import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable } from '@shared/components/pressable';
import { colors } from '@theme/colors';
import { X } from 'lucide-react-native';

export function QuestionnaireDemoScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useTranslation();

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
      </View>
    </SafeAreaView>
  );
}
