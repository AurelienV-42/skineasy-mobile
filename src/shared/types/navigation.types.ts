import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'

// Auth Stack
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

// Dashboard Stack
export type DashboardStackParamList = {
  Dashboard: undefined
}

// Routine Stack
export type RoutineStackParamList = {
  Routine: undefined
}

// Profile Stack
export type ProfileStackParamList = {
  Profile: undefined
  DiagnosisWebView: undefined
}

// Main Tabs
export type MainTabsParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>
  RoutineTab: NavigatorScreenParams<RoutineStackParamList>
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>
}

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainTabsParamList>
}

// Screen props types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DashboardStackParamList, T>,
    BottomTabScreenProps<MainTabsParamList>
  >

export type RoutineStackScreenProps<T extends keyof RoutineStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RoutineStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>

// Declare global navigation types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
