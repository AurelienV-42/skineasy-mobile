import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Pressable as RNPressable, StyleSheet, View } from 'react-native';

import { colors } from '@theme/colors';

import { FAB_DIAMETER, FAB_RADIUS } from './constants';

export type FabVariant = 'solid' | 'glass' | 'gradient';

type FabProps = {
  variant: FabVariant;
  glassAvailable: boolean;
  onPress: () => void;
};

export function Fab({ variant, glassAvailable, onPress }: FabProps): React.ReactElement {
  const inner = (
    <RNPressable onPress={onPress} style={styles.hit}>
      <Plus color={colors.white} size={28} strokeWidth={2.5} />
    </RNPressable>
  );

  if (variant === 'glass' && glassAvailable) {
    return (
      <GlassView style={styles.base} glassEffectStyle="clear" isInteractive>
        {inner}
      </GlassView>
    );
  }

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.shadow]}
      >
        {inner}
      </LinearGradient>
    );
  }

  return <View style={[styles.base, styles.solid]}>{inner}</View>;
}

const styles = StyleSheet.create({
  base: {
    width: FAB_DIAMETER,
    height: FAB_DIAMETER,
    borderRadius: FAB_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  shadow: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  hit: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FAB_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
