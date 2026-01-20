import { Redirect } from 'expo-router'
import {
  TabList,
  Tabs,
  TabsDescriptor,
  TabSlot,
  TabsSlotRenderOptions,
  TabTrigger,
} from 'expo-router/ui'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { FloatingTabBar, SPRING_CONFIG } from '@shared/components/FloatingTabBar'
import { useAuthStore } from '@shared/stores/auth.store'


export default function TabsLayout(): React.ReactElement | null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { width } = useWindowDimensions()
  const activeIndex = useSharedValue(0)

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  const renderTabScreen = (
    descriptor: TabsDescriptor,
    { index, isFocused, loaded }: TabsSlotRenderOptions
  ): React.ReactElement | null => {
    if (!loaded && !isFocused) {
      return null
    }

    if (isFocused && activeIndex.value !== index) {
      activeIndex.value = withSpring(index, SPRING_CONFIG)
    }

    return (
      <AnimatedScreen
        key={descriptor.route.key}
        index={index}
        activeIndex={activeIndex}
        width={width}
      >
        {descriptor.render()}
      </AnimatedScreen>
    )
  }

  return (
    <View className="flex-1">
      <Tabs>
        <TabSlot renderFn={renderTabScreen} detachInactiveScreens={false} />
        <TabList style={{ display: 'none' }}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="routine" href="/routine" />
          <TabTrigger name="profile" href="/profile" />
        </TabList>
        <FloatingTabBar />
      </Tabs>
    </View>
  )
}

type AnimatedScreenProps = {
  index: number
  activeIndex: SharedValue<number>
  width: number
  children: React.ReactNode
}

function AnimatedScreen({
  index,
  activeIndex,
  width,
  children,
}: AnimatedScreenProps): React.ReactElement {
  const animatedStyle = useAnimatedStyle(() => {
    const offset = (index - activeIndex.value) * width
    return {
      transform: [{ translateX: offset }],
    }
  })

  return <Animated.View style={[styles.screen, animatedStyle]}>{children}</Animated.View>
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
  },
})
