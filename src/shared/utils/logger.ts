/**
 * Centralized Logger Utility
 *
 * Provides consistent logging across the app with environment-based control.
 * All logs are automatically disabled in production builds.
 * Each log includes a timestamp for debugging.
 *
 * Usage:
 * - logger.debug('Debug info', { data })
 * - logger.info('Info message')
 * - logger.warn('Warning message')
 * - logger.error('Error message', error)
 */

class Logger {
  private enabled: boolean

  constructor() {
    // Only enable logging in development mode
    this.enabled = __DEV__
  }

  /**
   * Format timestamp for logs (HH:MM:SS.mmm)
   */
  private getTimestamp(): string {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0')
    return `${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  /**
   * Debug logs - For detailed debugging information
   * Use for: Developer-only information, verbose data dumps
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.enabled) return
    console.log(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args)
  }

  /**
   * Info logs - For general information
   * Use for: App flow tracking, user actions, state changes
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.enabled) return
    console.log(`[${this.getTimestamp()}] [INFO] ${message}`, ...args)
  }

  /**
   * Warning logs - For non-critical issues
   * Use for: Deprecated API usage, fallback behaviors, potential issues
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.enabled) return
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args)
  }

  /**
   * Error logs - For errors and exceptions
   * Use for: Caught errors, API failures, validation errors
   */
  error(message: string, ...args: unknown[]): void {
    if (!this.enabled) return
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args)
  }

  /**
   * Group logs together (collapsible in browser/console)
   */
  group(label: string): void {
    if (!this.enabled) return
    console.group(label)
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    if (!this.enabled) return
    console.groupEnd()
  }

  /**
   * Log a table (useful for arrays/objects)
   */
  table(data: unknown): void {
    if (!this.enabled) return
    console.table(data)
  }

  /**
   * Manually enable/disable logging (useful for testing)
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Check if logging is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }
}

export const logger = new Logger()
