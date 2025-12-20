import { vi } from 'vitest'

// Mock react-native modules
vi.mock('react-native', async () => {
  return {
    Platform: {
      OS: 'ios',
      select: vi.fn((obj) => obj.ios),
    },
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
    },
  }
})

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}))

// Mock expo-localization
vi.mock('expo-localization', () => ({
  locale: 'en-US',
  locales: ['en-US'],
  getLocales: vi.fn(() => [{ languageCode: 'en', regionCode: 'US' }]),
}))

// Global test utilities
declare global {
  // eslint-disable-next-line no-var
  var __TEST__: boolean
}

globalThis.__TEST__ = true
