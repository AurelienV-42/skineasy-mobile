import { forwardRef } from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller';

export interface KeyboardScrollViewProps extends KeyboardAwareScrollViewProps {
  /**
   * Distance between keyboard and focused input
   * @default 16
   */
  bottomOffset?: number;
}

/**
 * A keyboard-aware ScrollView that automatically scrolls to focused TextInput.
 * Uses react-native-keyboard-controller for native performance.
 *
 * @example
 * ```tsx
 * <KeyboardScrollView>
 *   <Input ... />
 *   <Input ... />
 *   <Button ... />
 * </KeyboardScrollView>
 * ```
 */
export const KeyboardScrollView = forwardRef<KeyboardAwareScrollViewRef, KeyboardScrollViewProps>(
  ({ bottomOffset = 16, children, ...props }, ref) => {
    return (
      <KeyboardAwareScrollView
        ref={ref}
        bottomOffset={bottomOffset}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  },
);

KeyboardScrollView.displayName = 'KeyboardScrollView';
