import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { useTabTrigger } from 'expo-router/ui'
import { Home, Sparkles, User } from 'lucide-react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
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

const TAB_COUNT = TABS.length
const BUBBLE_PADDING = 8

type TabButtonProps = {
  tab: TabConfig
  onFocusChange: (index: number, isFocused: boolean) => void
  index: number
}

function TabButton({ tab, onFocusChange, index }: TabButtonProps): React.ReactElement {
  const { t } = useTranslation()
  const { trigger, triggerProps } = useTabTrigger({ name: tab.name, href: tab.href })
  const Icon = tab.icon
  const isFocused = trigger?.isFocused ?? false
  const color = isFocused ? colors.primary : colors.textMuted

  useEffect(() => {
    onFocusChange(index, isFocused)
  }, [isFocused, index, onFocusChange])

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

type TabBarContentProps = {
  containerWidth: number
}

function TabBarContent({ containerWidth }: TabBarContentProps): React.ReactElement {
  const activeIndex = useSharedValue(0)
  const tabWidth = containerWidth / TAB_COUNT
  const bubbleWidth = tabWidth - BUBBLE_PADDING * 2

  const handleFocusChange = (index: number, isFocused: boolean): void => {
    if (isFocused) {
      activeIndex.value = withSpring(index, { damping: 36, stiffness: 200 })
    }
  }

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndex.value * tabWidth + BUBBLE_PADDING }],
    width: bubbleWidth,
  }))

  return (
    <>
      <Animated.View style={[styles.bubble, bubbleStyle]} />
      {TABS.map((tab, index) => (
        <TabButton key={tab.name} tab={tab} index={index} onFocusChange={handleFocusChange} />
      ))}
    </>
  )
}

export function FloatingTabBar(): React.ReactElement {
  const insets = useSafeAreaInsets()
  const isGlassAvailable = isLiquidGlassAvailable()
  const containerWidth = useSharedValue(0)

  const bottomPosition = Math.max(insets.bottom, 16)

  const handleLayout = (event: LayoutChangeEvent): void => {
    containerWidth.value = event.nativeEvent.layout.width
  }

  if (isGlassAvailable) {
    return (
      <GlassView
        style={[styles.container, { bottom: bottomPosition }]}
        glassEffectStyle="regular"
        onLayout={handleLayout}
      >
        {containerWidth.value > 0 && <TabBarContent containerWidth={containerWidth.value} />}
      </GlassView>
    )
  }

  return (
    <View
      style={[styles.container, styles.fallback, { bottom: bottomPosition }]}
      onLayout={handleLayout}
    >
      {containerWidth.value > 0 && <TabBarContent containerWidth={containerWidth.value} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  bubble: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
  },
})
