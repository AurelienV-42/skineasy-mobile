import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LayoutChangeEvent, Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@theme/colors';

type GlassEffectStyle = 'clear' | 'regular';

type GlassContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  glassStyle?: GlassEffectStyle;
  onLayout?: (event: LayoutChangeEvent) => void;
  tintColor?: string;
  isInteractive?: boolean;
};

export function GlassContainer({
  children,
  style,
  glassStyle = 'regular',
  onLayout,
  tintColor = colors.surface,
  isInteractive = false,
}: GlassContainerProps): React.ReactElement {
  const isGlassAvailable = isLiquidGlassAvailable();

  if (isGlassAvailable) {
    return (
      <GlassView
        style={[styles.container, style]}
        glassEffectStyle={glassStyle}
        onLayout={onLayout}
        tintColor={tintColor}
        isInteractive={isInteractive}
      >
        {children}
      </GlassView>
    );
  }

  const isTransparent = !tintColor || tintColor === 'transparent';

  return (
    <View
      style={[
        styles.container,
        isTransparent ? styles.fallbackTransparent : styles.fallbackOpaque,
        !isTransparent && { backgroundColor: tintColor },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.creamMuted,
  },
  fallbackOpaque: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      default: {},
    }),
  },
  fallbackTransparent: {},
});
