/**
 * Bottom Sheet Component
 *
 * A reusable bottom sheet modal that slides up from the bottom.
 * Used for action sheets, pickers, and other modal content.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Dimensions,
  type LayoutChangeEvent,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_HEIGHT = Dimensions.get('window').height
const HANDLE_HEIGHT = 28 // py-3 (12*2) + handle height (4)
const MAX_HEIGHT_RATIO = 0.9 // Max 90% of screen

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  height?: number | 'auto' // Height in pixels or 'auto'
  snapPoints?: number[] // Snap positions (0-1)
}

export function BottomSheet({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.6, // Default 60% of screen
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const slideAnim = useRef(new Animated.Value(0)).current
  const backdropAnim = useRef(new Animated.Value(0)).current
  const [contentHeight, setContentHeight] = useState(0)

  const isAutoHeight = height === 'auto'
  const maxHeight = SCREEN_HEIGHT * MAX_HEIGHT_RATIO

  // Calculate sheet height: fixed, or auto-measured (capped at maxHeight)
  const sheetHeight = isAutoHeight
    ? contentHeight > 0
      ? Math.min(contentHeight + HANDLE_HEIGHT + insets.bottom, maxHeight)
      : SCREEN_HEIGHT * 0.5 // Initial estimate before measurement
    : height

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height: measuredHeight } = event.nativeEvent.layout
      if (measuredHeight > 0 && measuredHeight !== contentHeight) {
        setContentHeight(measuredHeight)
      }
    },
    [contentHeight]
  )

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, slideAnim, backdropAnim])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight, 0],
  })

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  })

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              opacity: backdropOpacity,
            }}
          />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: sheetHeight + insets.bottom,
            transform: [{ translateY }],
          }}
        >
          <View
            className="bg-surface rounded-t-3xl flex-1"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {/* Handle */}
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-border rounded-full" />
            </View>

            {/* Content */}
            <View
              className={isAutoHeight ? '' : 'flex-1'}
              style={{ paddingBottom: insets.bottom }}
              onLayout={isAutoHeight ? handleContentLayout : undefined}
            >
              {children}
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
