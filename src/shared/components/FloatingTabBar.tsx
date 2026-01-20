import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { useTabTrigger } from 'expo-router/ui'
import { Home, Sparkles, User } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@theme/colors'

type TabConfig = {
  name: string
  href: string
  labelKey: string
  icon: typeof Home
}

const TABS: TabConfig[] = [
  { name: 'index', href: '/', labelKey: 'dashboard.today', icon: Home },
  { name: 'routine', href: '/routine', labelKey: 'routine.title', icon: Sparkles },
  { name: 'profile', href: '/profile', labelKey: 'profile.title', icon: User },
]

type TabButtonProps = {
  tab: TabConfig
}

function TabButton({ tab }: TabButtonProps): React.ReactElement {
  const { t } = useTranslation()
  const { trigger, triggerProps } = useTabTrigger({ name: tab.name, href: tab.href })
  const Icon = tab.icon
  const isFocused = trigger?.isFocused ?? false
  const color = isFocused ? colors.primary : colors.textMuted

  return (
    <Pressable
      style={styles.tabButton}
      onPress={triggerProps.onPress}
      onLongPress={triggerProps.onLongPress}
    >
      <Icon color={color} size={24} />
      <Text style={[styles.tabLabel, { color }]}>{t(tab.labelKey)}</Text>
    </Pressable>
  )
}

export function FloatingTabBar(): React.ReactElement {
  const insets = useSafeAreaInsets()
  const isGlassAvailable = isLiquidGlassAvailable()

  const tabs = TABS.map((tab) => <TabButton key={tab.name} tab={tab} />)
  const bottomPosition = Math.max(insets.bottom, 16)

  if (isGlassAvailable) {
    return (
      <GlassView style={[styles.container, { bottom: bottomPosition }]} glassEffectStyle="regular">
        {tabs}
      </GlassView>
    )
  }

  return <View style={[styles.container, styles.fallback, { bottom: bottomPosition }]}>{tabs}</View>
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 32,
  },
  fallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
  },
})
