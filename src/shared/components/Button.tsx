import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native'

import { colors } from '@theme/colors'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string
  variant?: ButtonVariant
  loading?: boolean
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
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant]
  const isDisabled = disabled || loading

  return (
    <Pressable
      className={`w-full py-4 rounded-md items-center justify-center ${styles.container} ${
        isDisabled ? 'opacity-50' : ''
      } ${className || ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
      ) : (
        <Text className={`text-base font-medium ${styles.text}`}>{title}</Text>
      )}
    </Pressable>
  )
}
