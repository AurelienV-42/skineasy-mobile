import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

import en from '@i18n/locales/en.json'
import fr from '@i18n/locales/fr.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
}

// Get device language code (e.g., 'en' from 'en-US')
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales()
  const languageCode = locales[0]?.languageCode ?? 'en'
  return languageCode
}

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
