export const colors = {
  // Primary
  primary: '#7D604E',
  primaryDark: '#E84C40',

  // Secondary
  secondary: '#E84C40',

  // Background
  background: '#F4E9E0',
  surface: '#FFF9F5',

  // Text
  text: '#333333',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',

  // Semantic
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Border
  border: '#F4E9E0',
  borderFocus: '#55C4B8',
} as const

export type ColorKey = keyof typeof colors
