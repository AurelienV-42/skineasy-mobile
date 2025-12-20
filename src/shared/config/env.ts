import Constants from 'expo-constants'

export const ENV = {
  API_URL: (Constants.expoConfig?.extra?.apiUrl as string) ?? 'https://api-dev.skineasy.com',
  TYPEFORM_ID: (Constants.expoConfig?.extra?.typeformId as string) ?? '',
  PRESTASHOP_URL: (Constants.expoConfig?.extra?.prestashopUrl as string) ?? 'https://skineasy.com',
  IS_DEV: __DEV__,
}
