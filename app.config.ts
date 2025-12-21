import { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Skin Easy',
  slug: 'skineasy-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFF9F5',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.skineasy.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFF9F5',
    },
    package: 'com.skineasy.app',
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  extra: {
    apiUrl: process.env.API_URL ?? 'https://api-dev.skineasy.com',
    typeformId: process.env.TYPEFORM_ID ?? '',
    prestashopUrl: process.env.PRESTASHOP_URL ?? 'https://skineasy.com',
    sentryDsn: process.env.SENTRY_DSN,
    eas: {
      projectId: 'dfbff412-fc10-4a77-b170-eb432c2969b9',
    },
  },
  scheme: 'skineasy',
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-localization',
    '@react-native-community/datetimepicker',
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'skineasy',
        organization: 'aurelien-vandaele',
      },
    ],
  ],
})
