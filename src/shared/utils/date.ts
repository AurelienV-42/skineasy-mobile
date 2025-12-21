/**
 * Date Utility Functions using date-fns
 *
 * Handles date formatting for API communication
 * IMPORTANT: API date parameters use YYYY-MM-DD format only
 * Frontend sends: "2025-01-15" (date-only format)
 * Backend stores: Full timestamps internally
 * Frontend displays: Converts to user's local timezone
 */

import {
  parseISO,
  format,
  isToday as isTodayFns,
  isYesterday as isYesterdayFns,
  isTomorrow as isTomorrowFns,
  subDays,
  addDays,
} from 'date-fns'

/**
 * Convert a local Date object to YYYY-MM-DD format
 * Used when sending dates to the API as query parameters
 *
 * @param date - Local Date object (e.g., user selects Jan 15, 2025)
 * @returns Date string in YYYY-MM-DD format (e.g., "2025-01-15")
 *
 * @example
 * const localDate = new Date(2025, 0, 15)
 * toUTCDateString(localDate) // "2025-01-15"
 */
export function toUTCDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Convert a UTC ISO string to a local Date object
 * Used when receiving dates from the API
 *
 * @param utcString - UTC ISO string (e.g., "2025-01-15T00:00:00.000Z")
 * @returns Local Date object
 *
 * @example
 * const utcString = "2025-01-15T00:00:00.000Z"
 * const localDate = fromUTCDateString(utcString)
 * // User in Paris sees: Jan 15, 2025 01:00 (GMT+1)
 */
export function fromUTCDateString(utcString: string): Date {
  return parseISO(utcString)
}

/**
 * Get today's date in YYYY-MM-DD format
 * Used for creating journal entries for "today"
 *
 * @returns Date string in YYYY-MM-DD format (e.g., "2025-01-15")
 *
 * @example
 * getTodayUTC() // "2025-01-15"
 */
export function getTodayUTC(): string {
  return toUTCDateString(new Date())
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 *
 * @returns Date string in YYYY-MM-DD format for yesterday
 */
export function getYesterdayUTC(): string {
  return toUTCDateString(subDays(new Date(), 1))
}

/**
 * Get tomorrow's date in YYYY-MM-DD format
 *
 * @returns Date string in YYYY-MM-DD format for tomorrow
 */
export function getTomorrowUTC(): string {
  return toUTCDateString(addDays(new Date(), 1))
}

/**
 * Format a date for display in the user's locale
 *
 * @param date - Date to format (can be Date object or UTC ISO string)
 * @param formatPattern - date-fns format pattern (default: 'PPPP' - full date)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(2025, 0, 15)) // "Wednesday, January 15th, 2025"
 * formatDate("2025-01-15T00:00:00.000Z", 'PP') // "Jan 15, 2025"
 */
export function formatDate(date: Date | string, formatPattern: string = 'PPPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatPattern)
}

/**
 * Format a date for short display (e.g., "Jan 15")
 *
 * @param date - Date to format (can be Date object or UTC ISO string)
 * @returns Formatted short date string
 *
 * @example
 * formatDateShort(new Date(2025, 0, 15)) // "Jan 15"
 * formatDateShort("2025-01-15T00:00:00.000Z") // "Jan 15"
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d')
}

/**
 * Check if a date is today
 *
 * @param date - Date to check (can be Date object or UTC ISO string)
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isTodayFns(dateObj)
}

/**
 * Check if a date is yesterday
 *
 * @param date - Date to check (can be Date object or UTC ISO string)
 * @returns True if the date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isYesterdayFns(dateObj)
}

/**
 * Check if a date is tomorrow
 *
 * @param date - Date to check (can be Date object or UTC ISO string)
 * @returns True if the date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isTomorrowFns(dateObj)
}
