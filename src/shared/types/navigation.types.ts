// Expo Router uses file-based routing, so we don't need traditional navigation types
// This file can be used for typed route parameters if needed

export type AuthRoutes = '/(auth)/login' | '/(auth)/register'

export type TabRoutes = '/(tabs)' | '/(tabs)/routine' | '/(tabs)/profile'

export type AppRoutes = AuthRoutes | TabRoutes
