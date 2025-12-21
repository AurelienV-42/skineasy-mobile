import { forwardRef } from 'react'
import { TextInput, View, Text, type TextInputProps } from 'react-native'

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
  ({ label, error, className, style, onFocus, enableHaptic = true, ...props }, ref) => {
    const handleFocus = (event: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      // Trigger selection haptic on focus
      if (enableHaptic) {
        haptic.selection()
      }

      // Call original onFocus handler
      if (onFocus) {
        onFocus(event)
      }
    }

    return (
      <View className="w-full mb-4">
        {label && <Text className="text-sm font-medium text-text mb-2">{label}</Text>}
        <TextInput
          ref={ref}
          className={`w-full h-12 bg-surface border rounded-md px-4 text-text ${
            error ? 'border-error' : 'border-border'
          } ${className || ''}`}
          placeholderTextColor={colors.textLight}
          textAlignVertical="center"
          style={[{ fontSize: 16, lineHeight: 20 }, style]}
          onFocus={handleFocus}
          {...props}
        />
        {error && <Text className="text-sm text-error mt-1">{error}</Text>}
      </View>
    )
  }
)

Input.displayName = 'Input'
