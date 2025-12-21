import { Text, ActivityIndicator, PressableProps } from 'react-native'

import { Pressable } from '@shared/components/Pressable'
import { colors } from '@theme/colors'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type HapticLevel = 'light' | 'medium' | 'heavy' | false

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string
  variant?: ButtonVariant
  loading?: boolean
  /**
   * Haptic feedback level - defaults to 'heavy' for buttons (save/submit actions)
   */
  haptic?: HapticLevel
}

const variantStyles = {
  primary: {
    container: 'bg-primary',
    containerPressed: 'bg-primary-dark',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-secondary',
    containerPressed: 'bg-secondary',
    text: 'text-text',
  },
  outline: {
    container: 'bg-transparent border border-primary',
    containerPressed: 'bg-primary/10 border border-primary',
    text: 'text-primary',
  },
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  haptic = 'heavy', // Default to heavy for buttons (save/submit actions)
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant]
  const isDisabled = disabled || loading

  return (
    <Pressable
      className={`w-full h-14 rounded-xl items-center justify-center ${styles.container} ${
        isDisabled ? 'opacity-50' : ''
      } ${className || ''}`}
      style={{
        shadowColor: variant === 'primary' ? colors.primary : '#000',
        shadowOffset: { width: 0, height: isDisabled ? 0 : 4 },
        shadowOpacity: isDisabled ? 0 : variant === 'primary' ? 0.25 : 0.1,
        shadowRadius: isDisabled ? 0 : 8,
        elevation: isDisabled ? 0 : 4,
      }}
      disabled={isDisabled}
      haptic={isDisabled ? false : haptic} // Disable haptic when button disabled
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
      ) : (
        <Text className={`text-base font-semibold ${styles.text}`}>{title}</Text>
      )}
    </Pressable>
  )
}
