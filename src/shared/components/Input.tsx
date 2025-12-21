import { forwardRef, useRef } from 'react'
import { Text, TextInput, View, type TextInputProps } from 'react-native'

import { useScrollContext } from '@shared/components/ScreenHeader'
import { haptic } from '@shared/utils/haptic'
import { colors } from '@theme/colors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  /**
   * Enable haptic feedback on focus (default: true)
   */
  enableHaptic?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, style, onFocus, enableHaptic = true, multiline, ...props }, ref) => {
    const scrollContext = useScrollContext()
    const containerRef = useRef<View>(null)

    const handleFocus = (event: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      // Trigger selection haptic on focus
      if (enableHaptic) {
        haptic.selection()
      }

      // Scroll to make input visible above keyboard
      if (scrollContext && containerRef.current) {
        // Delay to let KeyboardAvoidingView adjust layout first
        // Need enough time for keyboard animation + layout recalculation
        setTimeout(() => {
          containerRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
            // pageY is the absolute position from top of the screen
            // We want to scroll so the input appears around 150px from top
            // Account for header (~80px) + desired padding (70px)
            const targetPosition = pageY - 150
            if (targetPosition > 0) {
              scrollContext.scrollToPosition(targetPosition)
            }
          })
        }, 300)
      }

      // Call original onFocus handler
      if (onFocus) {
        onFocus(event)
      }
    }

    return (
      <View ref={containerRef} className="w-full mb-4">
        {label && <Text className="text-sm font-medium text-text mb-2">{label}</Text>}
        <TextInput
          ref={ref}
          className={`w-full ${multiline ? 'min-h-20 py-3' : 'h-12'} bg-surface border rounded-md px-4 text-text ${
            error ? 'border-error' : 'border-border'
          } ${className || ''}`}
          placeholderTextColor={colors.textLight}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[{ fontSize: 16, lineHeight: 20 }, style]}
          onFocus={handleFocus}
          multiline={multiline}
          {...props}
        />
        {error && <Text className="text-sm text-error mt-1">{error}</Text>}
      </View>
    )
  }
)

Input.displayName = 'Input'
