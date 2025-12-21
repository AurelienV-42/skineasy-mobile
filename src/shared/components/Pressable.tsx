import { Pressable as RNPressable, type PressableProps } from 'react-native'

/**
 * Custom Pressable component with opacity feedback
 *
 * Provides visual feedback by reducing opacity when pressed,
 * which is a standard mobile UX pattern.
 *
 * @example
 * ```tsx
 * import { Pressable } from '@shared/components/Pressable'
 *
 * <Pressable onPress={handlePress}>
 *   <Text>Tap me</Text>
 * </Pressable>
 * ```
 */
export function Pressable({ style, ...props }: PressableProps) {
  return (
    <RNPressable
      style={({ pressed }) => [
        typeof style === 'function' ? style({ pressed }) : style,
        { opacity: pressed ? 0.6 : 1 },
      ]}
      {...props}
    />
  )
}
