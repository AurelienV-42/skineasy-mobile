import { format, isValid, parse } from 'date-fns'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Animated, Text, TextInput, View, type TextInputProps } from 'react-native'

import { useScrollContext } from '@shared/components/ScreenHeader'
import { cn } from '@shared/utils/cn'
import { haptic } from '@shared/utils/haptic'
import { colors } from '@theme/colors'

interface DateInputProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'> {
  label?: string
  error?: string
  /**
   * Value in YYYY-MM-DD format (API format), can also be ISO format
   */
  value?: string
  /**
   * Callback with value in YYYY-MM-DD format
   */
  onChangeText?: (value: string) => void
  /**
   * Enable haptic feedback on focus (default: true)
   */
  enableHaptic?: boolean
}

/**
 * Converts YYYY-MM-DD (or ISO format) to DD-MM-YYYY for display
 */
function toDisplayFormat(apiDate: string | undefined): string {
  if (!apiDate) return ''

  // Handle ISO format by extracting date part
  const dateOnly = apiDate.includes('T') ? apiDate.split('T')[0] : apiDate

  const parsed = parse(dateOnly, 'yyyy-MM-dd', new Date())
  if (!isValid(parsed)) return ''

  return format(parsed, 'dd-MM-yyyy')
}

/**
 * Converts DD-MM-YYYY to YYYY-MM-DD for API
 */
function toApiFormat(displayDate: string): string {
  const parsed = parse(displayDate, 'dd-MM-yyyy', new Date())
  if (!isValid(parsed)) return ''

  return format(parsed, 'yyyy-MM-dd')
}

/**
 * Formats input as DD-MM-YYYY while typing
 */
function formatAsUserTypes(input: string): string {
  // Remove any non-digit characters
  const digits = input.replace(/\D/g, '')

  // Limit to 8 digits (DDMMYYYY)
  const limited = digits.slice(0, 8)

  // Add dashes as user types
  if (limited.length <= 2) {
    return limited
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}-${limited.slice(2)}`
  } else {
    return `${limited.slice(0, 2)}-${limited.slice(2, 4)}-${limited.slice(4)}`
  }
}

export const DateInput = forwardRef<TextInput, DateInputProps>(
  (
    {
      label,
      error,
      className,
      style,
      onFocus,
      onBlur,
      enableHaptic = true,
      value,
      onChangeText,
      ...props
    },
    ref
  ) => {
    const scrollContext = useScrollContext()
    const containerRef = useRef<View>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [displayValue, setDisplayValue] = useState(toDisplayFormat(value))

    // Sync display value when value prop changes (e.g., form loads with default values)
    useEffect(() => {
      const formatted = toDisplayFormat(value)
      setDisplayValue(formatted)
    }, [value])

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
      if (!displayValue) {
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

    const handleChangeText = (text: string) => {
      const formatted = formatAsUserTypes(text)
      setDisplayValue(formatted)

      // Only call onChangeText with API format when we have a complete date
      if (onChangeText) {
        if (formatted.length === 10) {
          // Complete date DD-MM-YYYY
          onChangeText(toApiFormat(formatted))
        } else if (formatted.length === 0) {
          onChangeText('')
        }
      }
    }

    // Label position interpolation (RN Animated API - refs are valid here)
    /* eslint-disable react-hooks/refs */
    const labelTop = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [13, -8],
    })

    const labelFontSize = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    })

    const labelLineHeight = labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 16],
    })
    /* eslint-enable react-hooks/refs */

    const labelColor = isFocused ? colors.primary : error ? colors.error : colors.textMuted

    return (
      <View ref={containerRef} className="w-full mb-6">
        <View
          className={cn(
            'relative bg-surface rounded-xl',
            isFocused
              ? 'border-2 border-primary'
              : error
                ? 'border-2 border-error'
                : 'border border-border',
            className
          )}
          style={{
            height: 24 + 40, // Icon Size + padding vertical
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
              className="absolute left-5 bg-surface px-1 rounded-full"
              style={{
                top: labelTop,
              }}
            >
              <Animated.Text
                style={{
                  fontSize: labelFontSize,
                  lineHeight: labelLineHeight,
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
            className="w-full h-full pr-4 pl-4 text-text"
            textAlignVertical="center"
            style={[{ fontSize: 14, lineHeight: 18 }, style]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={displayValue}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            maxLength={10}
            {...props}
          />
        </View>

        {/* Error Message */}
        {error && <Text className="text-xs text-error mt-1 ml-4">{error}</Text>}
      </View>
    )
  }
)

DateInput.displayName = 'DateInput'
