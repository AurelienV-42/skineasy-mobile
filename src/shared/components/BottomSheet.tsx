/**
 * Bottom Sheet Component
 *
 * A reusable bottom sheet using native iOS/Android sheet.
 * Wraps @lodev09/react-native-true-sheet with declarative API.
 */

import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useEffect, useRef } from 'react'
import { Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../theme/colors'

const SCREEN_HEIGHT = Dimensions.get('window').height

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  height?: number | 'auto'
  scrollable?: boolean
}

export function BottomSheet({
  visible,
  onClose,
  children,
  height = 'auto',
  scrollable = false,
}: BottomSheetProps) {
  const sheet = useRef<TrueSheet>(null)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (visible) {
      sheet.current?.present()
    } else {
      sheet.current?.dismiss()
    }
  }, [visible])

  // Convert height prop to detents
  const detents: (number | 'auto')[] = height === 'auto' ? ['auto'] : [height / SCREEN_HEIGHT]

  return (
    <TrueSheet
      ref={sheet}
      detents={detents}
      backgroundColor={colors.background}
      onDidDismiss={onClose}
      grabber
      scrollable={scrollable}
    >
      {children}
    </TrueSheet>
  )
}
