import { forwardRef } from 'react'
import { TextInput, View, Text, TextInputProps } from 'react-native'

import { colors } from '@theme/colors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, style, ...props }, ref) => {
    return (
      <View className="w-full mb-4">
        {label && (
          <Text className="text-sm font-medium text-text mb-2">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`w-full h-12 bg-surface border rounded-md px-4 text-text ${
            error ? 'border-error' : 'border-border'
          } ${className || ''}`}
          placeholderTextColor={colors.textLight}
          textAlignVertical="center"
          style={[{ fontSize: 16, lineHeight: 20 }, style]}
          {...props}
        />
        {error && (
          <Text className="text-sm text-error mt-1">{error}</Text>
        )}
      </View>
    )
  }
)

Input.displayName = 'Input'
