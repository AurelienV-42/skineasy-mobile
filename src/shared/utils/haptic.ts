import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

const IS_NATIVE = Platform.OS === 'ios' || Platform.OS === 'android'

/**
 * Haptic Feedback Utility
 *
 * Provides tactile feedback for user interactions across the app.
 * Only works on iOS and Android - gracefully degrades on web.
 * Logs in DEV mode for debugging.
 */

type ImpactLevel = 'light' | 'medium' | 'heavy'
type NotificationType = 'success' | 'error' | 'warning'

/**
 * Triggers impact haptic feedback
 *
 * @param level - 'light' | 'medium' | 'heavy'
 *
 * Usage guidelines:
 * - light: Reversible actions (selections, toggles, back button)
 * - medium: Navigation, context switches (journal cards, profile menu)
 * - heavy: Data persistence, authentication, irreversible actions
 */
export const impact = (level: ImpactLevel): void => {
  if (!IS_NATIVE) return

  if (__DEV__) {
    console.log(`[Haptic] Impact: ${level}`)
  }

  try {
    switch (level) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        break
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        break
    }
  } catch (error) {
    // Fail silently - haptic feedback is non-critical
    if (__DEV__) {
      console.warn('[Haptic] Impact failed:', error)
    }
  }
}

/**
 * Triggers selection haptic feedback
 *
 * Used for focus changes, lightweight selections
 */
export const selection = (): void => {
  if (!IS_NATIVE) return

  if (__DEV__) {
    console.log('[Haptic] Selection')
  }

  try {
    Haptics.selectionAsync()
  } catch (error) {
    if (__DEV__) {
      console.warn('[Haptic] Selection failed:', error)
    }
  }
}

/**
 * Triggers notification haptic feedback
 *
 * @param type - 'success' | 'error' | 'warning'
 *
 * Used for form validations, API responses, critical user feedback
 */
export const notification = (type: NotificationType): void => {
  if (!IS_NATIVE) return

  if (__DEV__) {
    console.log(`[Haptic] Notification: ${type}`)
  }

  try {
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        break
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        break
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        break
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[Haptic] Notification failed:', error)
    }
  }
}

/**
 * Convenience exports for common patterns
 */
export const haptic = {
  impact,
  selection,
  notification,

  // Shorthand methods for common actions
  heavy: () => impact('heavy'),
  medium: () => impact('medium'),
  light: () => impact('light'),
  success: () => notification('success'),
  error: () => notification('error'),
  warning: () => notification('warning'),
}
