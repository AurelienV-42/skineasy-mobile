import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

type KeyboardBehavior = 'height' | 'padding' | 'translate-with-padding'

export interface KeyboardViewProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  /**
   * Behavior of the keyboard avoiding view.
   * - 'padding': Adds padding to push content up (recommended)
   * - 'height': Adjusts the height of the container
   * - 'translate-with-padding': Combines translate animation with padding
   * @default 'padding'
   */
  behavior?: KeyboardBehavior
  /**
   * Enable or disable the keyboard avoiding behavior
   * @default true
   */
  enabled?: boolean
  /**
   * Additional offset to add to the keyboard height
   * @default 0
   */
  keyboardVerticalOffset?: number
}

/**
 * A keyboard-avoiding View that adjusts when keyboard appears.
 * Uses react-native-keyboard-controller for consistent iOS/Android behavior.
 *
 * Use this for screens with few inputs where scrolling isn't needed.
 * For forms with many inputs, use KeyboardScrollView instead.
 *
 * @example
 * ```tsx
 * <KeyboardView style={{ flex: 1 }}>
 *   <View>
 *     <Input ... />
 *     <Button ... />
 *   </View>
 * </KeyboardView>
 * ```
 */
export function KeyboardView({
  behavior = 'padding',
  children,
  style,
  enabled = true,
  keyboardVerticalOffset = 0,
}: KeyboardViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      style={style}
      enabled={enabled}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
