export const colors = {
  // Primary
  primary: '#55C4B8',
  primaryDark: '#2C8F84',

  // Secondary
  secondary: '#F7B6A8',

  // Background
  background: '#FFF9F5',
  surface: '#FFFFFF',

  // Text
  text: '#333333',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',

  // Semantic
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Border
  border: '#E5E7EB',
  borderFocus: '#55C4B8',
} as const

export type ColorKey = keyof typeof colors
