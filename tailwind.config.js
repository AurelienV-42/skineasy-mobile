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
        cream: {
          DEFAULT: colors.cream,
          muted: colors.creamMuted,
        },
        brown: {
          dark: colors.brownDark,
          light: colors.brownLight,
        },
      },
      fontFamily: {
        normal: ['ChocolatesRegular'],
        medium: ['ChocolatesMedium'],
        bold: ['ChocolatesBold'],
      },
      fontSize: {
        // Override default font sizes to use 1.2 line height for Chocolates font
        xs: ['0.75rem', { lineHeight: '0.9rem' }],
        sm: ['0.875rem', { lineHeight: '1.05rem' }],
        base: ['1rem', { lineHeight: '1.2rem' }],
        lg: ['1.125rem', { lineHeight: '1.35rem' }],
        xl: ['1.25rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.8rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.7rem' }],
        '5xl': ['3rem', { lineHeight: '3.6rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.5rem' }],
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
        xl: '20px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
