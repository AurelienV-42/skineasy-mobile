const { colors } = require('./src/theme/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary,
          dark: colors.primaryDark,
        },
        secondary: colors.secondary,
        background: colors.background,
        surface: colors.surface,
        text: {
          DEFAULT: colors.text,
          muted: colors.textMuted,
          light: colors.textLight,
        },
        error: colors.error,
        success: colors.success,
        warning: colors.warning,
        border: {
          DEFAULT: colors.border,
          focus: colors.borderFocus,
        },
      },
      fontFamily: {
        normal: ['Roboto_400Regular'],
        medium: ['Roboto_500Medium'],
        bold: ['Roboto_700Bold'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
