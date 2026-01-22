import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native'

type GlassEffectStyle = 'clear' | 'regular'

type GlassContainerProps = {
  children: React.ReactNode
  style?: ViewStyle
  glassStyle?: GlassEffectStyle
  onLayout?: (event: LayoutChangeEvent) => void
}

export function GlassContainer({
  children,
  style,
  glassStyle = 'clear',
  onLayout,
}: GlassContainerProps): React.ReactElement {
  const isGlassAvailable = isLiquidGlassAvailable()

  if (isGlassAvailable) {
    return (
      <GlassView
        style={[styles.container, style]}
        glassEffectStyle={glassStyle}
        onLayout={onLayout}
      >
        {children}
      </GlassView>
    )
  }

  return (
    <View style={[styles.container, styles.fallback, style]} onLayout={onLayout}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
})
