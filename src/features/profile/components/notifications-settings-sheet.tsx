import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Text, View } from 'react-native';

import { BottomSheet } from '@shared/components/bottom-sheet';
import { getNotificationPref, setNotificationPref } from '@shared/services/notifications.service';
import type { NotificationKind } from '@shared/services/notifications.storage';
import { colors } from '@theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Row {
  kind: NotificationKind;
  labelKey: string;
  helpKey: string;
}

const ROWS: Row[] = [
  {
    kind: 'dailyJournal',
    labelKey: 'notifications.settings.dailyJournal',
    helpKey: 'notifications.settings.dailyJournalHelp',
  },
  {
    kind: 'bedtime',
    labelKey: 'notifications.settings.bedtime',
    helpKey: 'notifications.settings.bedtimeHelp',
  },
  {
    kind: 'mealPlanning',
    labelKey: 'notifications.settings.mealPlanning',
    helpKey: 'notifications.settings.mealPlanningHelp',
  },
];

function getInitialPrefs(): Record<NotificationKind, boolean> {
  return {
    dailyJournal: getNotificationPref('dailyJournal'),
    bedtime: getNotificationPref('bedtime'),
    mealPlanning: getNotificationPref('mealPlanning'),
  };
}

export function NotificationsSettingsSheet({ visible, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState<Record<NotificationKind, boolean>>(getInitialPrefs);

  const handleToggle = (kind: NotificationKind, value: boolean): void => {
    setPrefs((prev) => ({ ...prev, [kind]: value }));
    void setNotificationPref(kind, value);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-6 pb-8">
        <Text className="text-xl font-bold text-text mb-2">
          {t('notifications.settings.title')}
        </Text>
        <Text className="text-sm text-textMuted mb-6">{t('notifications.settings.subtitle')}</Text>

        {ROWS.map((row) => (
          <View
            key={row.kind}
            className="flex-row items-center justify-between py-4 border-b border-border"
          >
            <View className="flex-1 pr-4">
              <Text className="text-base text-text">{t(row.labelKey)}</Text>
              <Text className="text-xs text-textMuted mt-1">{t(row.helpKey)}</Text>
            </View>
            <Switch
              value={prefs[row.kind]}
              onValueChange={(value) => handleToggle(row.kind, value)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        ))}
      </View>
    </BottomSheet>
  );
}
