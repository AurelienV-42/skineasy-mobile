/**
 * Bottom Sheet Component
 *
 * A reusable bottom sheet modal that slides up from the bottom.
 * Supports drag-to-close gesture and dynamic height.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_HEIGHT = Dimensions.get('window').height
const HANDLE_HEIGHT = 28
const MAX_HEIGHT_RATIO = 0.9
const CLOSE_THRESHOLD = 0.25
const VELOCITY_THRESHOLD = 500

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  height?: number | 'auto'
  contentHeight?: number
}

export function BottomSheet({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.6,
  contentHeight: externalContentHeight,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const [measuredHeight, setMeasuredHeight] = useState(0)

  const isAutoHeight = height === 'auto'
  const maxHeight = SCREEN_HEIGHT * MAX_HEIGHT_RATIO

  const autoContentHeight = externalContentHeight ?? measuredHeight
  const sheetHeight = isAutoHeight
    ? autoContentHeight > 0
      ? Math.min(autoContentHeight + HANDLE_HEIGHT + insets.bottom, maxHeight)
      : SCREEN_HEIGHT * 0.5
    : height

  const translateY = useSharedValue(sheetHeight)

  // Open animation
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) })
    } else {
      translateY.value = sheetHeight
    }
  }, [visible, sheetHeight, translateY])

  // Pan gesture for drag-to-close
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY)
    })
    .onEnd((e) => {
      const shouldClose =
        translateY.value > sheetHeight * CLOSE_THRESHOLD || e.velocityY > VELOCITY_THRESHOLD

      if (shouldClose) {
        runOnJS(onClose)()
      } else {
        translateY.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.cubic) })
      }
    })

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height: layoutHeight } = event.nativeEvent.layout
      if (layoutHeight > 0 && layoutHeight !== measuredHeight) {
        setMeasuredHeight(layoutHeight)
      }
    },
    [measuredHeight]
  )

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

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
        <Pressable onPress={onClose} style={{ flex: 1 }}>
          <View className="absolute inset-0 bg-black/50" />
        </Pressable>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              { position: 'absolute', bottom: 0, left: 0, right: 0, height: sheetHeight },
              sheetStyle,
            ]}
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
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  )
}
