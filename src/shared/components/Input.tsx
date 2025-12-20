import { forwardRef } from 'react'
import { TextInput, View, Text, TextInputProps } from 'react-native'

import { colors } from '@theme/colors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <View className="w-full mb-4">
        {label && (
          <Text className="text-sm font-medium text-text mb-2">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`w-full bg-surface border rounded-md px-4 py-3 text-base text-text ${
            error ? 'border-error' : 'border-border'
          } ${className || ''}`}
          placeholderTextColor={colors.textLight}
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
