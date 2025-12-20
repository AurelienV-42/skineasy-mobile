export const typography = {
  h1: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
} as const

export type TypographyKey = keyof typeof typography
