import { Redirect } from 'expo-router'
import { TabList, TabSlot, Tabs, TabTrigger } from 'expo-router/ui'
import { View } from 'react-native'

import { FloatingTabBar } from '@shared/components/FloatingTabBar'
import { useAuthStore } from '@shared/stores/auth.store'

export default function TabsLayout(): React.ReactElement | null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <View className="flex-1">
      <Tabs>
        <TabSlot />
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
