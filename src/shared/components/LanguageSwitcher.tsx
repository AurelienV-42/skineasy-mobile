import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Pressable } from '@shared/components/Pressable'
import { appConfig } from '@shared/config/appConfig'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  if (!appConfig.features.languageSwitcher) {
    return null
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(newLang)
  }

  return (
    <View className="flex-row justify-end px-4 pt-2">
      <Pressable
        onPress={toggleLanguage}
        className="px-3 py-2 bg-surface rounded-full border border-border"
      >
        <Text className="text-text font-medium">{i18n.language.toUpperCase()}</Text>
      </Pressable>
    </View>
  )
}
