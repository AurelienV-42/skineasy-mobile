import { Eye, EyeOff } from 'lucide-react-native'
import { forwardRef, useRef, useState } from 'react'
import { Animated, Text, TextInput, View, type TextInputProps } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
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
  /**
   * Show password visibility toggle (only for secureTextEntry inputs)
   */
  showPasswordToggle?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      className,
      style,
      onFocus,
      onBlur,
      enableHaptic = true,
      multiline,
      showPasswordToggle = false,
      secureTextEntry,
      value,
      ...props
    },
    ref
  ) => {
    const scrollContext = useScrollContext()
    const containerRef = useRef<View>(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    // Floating label animation
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current

    const handleFocus = (event: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true)

      // Animate label up
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()

      // Trigger selection haptic on focus
      if (enableHaptic) {
        haptic.selection()
      }

      // Scroll to make input visible above keyboard (if in ScreenHeader context)
      if (scrollContext) {
        // Simple scroll up to make room for keyboard
        scrollContext.scrollToPosition(200)
      }

      // Call original onFocus handler
      if (onFocus) {
        onFocus(event)
      }
    }

    const handleBlur = (event: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setIsFocused(false)

      // Animate label down if no value
      if (!value) {
        Animated.timing(labelAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start()
      }

      // Call original onBlur handler
      if (onBlur) {
        onBlur(event)
      }
    }

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
    }

    // Label position interpolation
    const labelTop = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [13, -8],
    })

    const labelFontSize = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    })

    const labelColor = isFocused ? colors.primary : error ? colors.error : colors.textMuted

    return (
      <View ref={containerRef} className="w-full mb-6">
        <View
          className={`relative ${multiline ? 'min-h-24' : 'h-14'} ${
            isFocused
              ? 'border-2 border-primary'
              : error
                ? 'border-2 border-error'
                : 'border border-border'
          } bg-surface rounded-xl ${className || ''}`}
          style={{
            shadowColor: isFocused ? colors.primary : '#000',
            shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
            shadowOpacity: isFocused ? 0.15 : 0.05,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 4 : 1,
          }}
        >
          {/* Floating Label */}
          {label && (
            <Animated.View
              pointerEvents="none"
              className="absolute left-4 bg-surface px-1 rounded-full"
              style={{
                top: labelTop,
              }}
            >
              <Animated.Text
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: '500',
                }}
              >
                {label}
              </Animated.Text>
            </Animated.View>
          )}

          {/* Input */}
          <TextInput
            ref={ref}
            className={`w-full h-full ${showPasswordToggle && secureTextEntry ? 'pr-14' : 'pr-4'} pl-4 text-text`}
            placeholderTextColor={colors.textLight}
            textAlignVertical={multiline ? 'top' : 'center'}
            style={[{ fontSize: 14, lineHeight: 18, paddingTop: multiline ? 12 : 0 }, style]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline={multiline}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            value={value}
            {...props}
          />

          {/* Password Toggle */}
          {showPasswordToggle && secureTextEntry && (
            <Pressable
              onPress={togglePasswordVisibility}
              haptic="light"
              className="absolute right-2 top-0 bottom-0 w-12 items-center justify-center"
              accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color={colors.textMuted} />
              ) : (
                <Eye size={20} color={colors.textMuted} />
              )}
            </Pressable>
          )}
        </View>

        {/* Error Message */}
        {error && <Text className="text-xs text-error mt-1 ml-4">{error}</Text>}
      </View>
    )
  }
)

Input.displayName = 'Input'
