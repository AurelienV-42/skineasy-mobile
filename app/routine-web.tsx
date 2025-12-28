/**
 * Web-only Routine Results Page (for iframe embedding)
 *
 * URL: /routine-web?rspid=xxx
 *
 * This page has no header/navigation - designed to be embedded in an iframe
 * on the PHP website at skineasy.com/fr/my-custom-page-mobile
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import { RoutineResultsContent } from '@features/routine/screens/RoutineResultsScreen'

function getRspidFromUrl(): string | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('rspid')
  }
  return null
}

export default function RoutineWebPage() {
  const { i18n } = useTranslation()
  const rspid = useMemo(() => getRspidFromUrl(), [])

  // Force French locale on web
  useEffect(() => {
    if (i18n.language !== 'fr') {
      i18n.changeLanguage('fr')
    }
  }, [i18n])

  return (
    <View className="flex-1 bg-white">
      <RoutineResultsContent rspid={rspid} />
    </View>
  )
}
