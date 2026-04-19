import { useTabTrigger } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Pressable } from '@shared/components/pressable';
import { colors } from '@theme/colors';

import { TabConfig } from './tabs';

type TabButtonProps = {
  tab: TabConfig;
};

export function TabButton({ tab }: TabButtonProps): React.ReactElement {
  const { t } = useTranslation();
  const { trigger, triggerProps } = useTabTrigger({ name: tab.name, href: tab.href });
  const Icon = tab.icon;
  const isFocused = trigger?.isFocused ?? false;
  const color = isFocused ? colors.primary : colors.textMuted;

  return (
    <Pressable
      className="flex-1 items-center justify-center gap-1"
      onPress={triggerProps.onPress}
      onLongPress={triggerProps.onLongPress}
    >
      <Icon color={color} size={24} strokeWidth={isFocused ? 2.4 : 2} />
      <Text className="font-medium" style={{ color, fontSize: 11 }}>
        {t(tab.labelKey)}
      </Text>
    </Pressable>
  );
}
