import * as Sentry from '@sentry/react-native'
import { ENV } from '@shared/config/env'
import type { RefreshTokenResponse } from '@shared/types/api.types'
import { getRefreshToken, getToken, setToken } from '@shared/utils/storage'
import { logger } from '@shared/utils/logger'
import Toast from 'react-native-toast-message'

interface ApiOptions extends Omit<RequestInit, 'body'> {
  skipAuth?: boolean
  body?: unknown
}

class ApiClient {
  private isRefreshing = false
  private refreshPromise: Promise<string | null> | null = null

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { skipAuth = false, body, ...fetchOptions } = options

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      apikey: ENV.API_KEY,
      ...options.headers,
    }

    if (!skipAuth) {
      const token = await getToken()
      if (token) {
        ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    }

    const url = `${ENV.API_URL}${endpoint}`
    logger.info('[API] Request:', { url, method: fetchOptions.method, body })

    let response: Response
    try {
      // Add 30 second timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      logger.info('[API] Response status:', response.status)

      // Log response body in DEV mode
      if (__DEV__ && response.ok) {
        const clonedResponse = response.clone()
        clonedResponse
          .json()
          .then((data) => {
            logger.info('[API] Response body:', data)
          })
          .catch(() => {
            // Ignore parse errors for logging
          })
      }
    } catch (error) {
      logger.error('[API] Fetch error:', error)
      // Log network errors to Sentry
      Sentry.captureException(error, {
        contexts: {
          api: {
            url,
            method: fetchOptions.method || 'GET',
            endpoint,
          },
        },
      })
      throw error
    }

    if (response.status === 401 && !skipAuth) {
      const newToken = await this.refreshAccessToken()
      if (newToken) {
        ;(headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`

        const retryController = new AbortController()
        const retryTimeoutId = setTimeout(() => retryController.abort(), 30000)

        const retryResponse = await fetch(`${ENV.API_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: retryController.signal,
        })

        clearTimeout(retryTimeoutId)

        if (!retryResponse.ok) {
          throw await this.handleError(retryResponse)
        }

        return retryResponse.json()
      } else {
        await this.handleSessionExpired()
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      throw await this.handleError(response)
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.doRefresh()

    try {
      return await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async doRefresh(): Promise<string | null> {
    try {
      logger.info('[API] Attempting to refresh access token')
      const refreshToken = await getRefreshToken()
      logger.info('[API] Retrieved refresh token from storage:', {
        hasToken: !!refreshToken,
        tokenLength: refreshToken?.length,
        tokenPreview: refreshToken?.substring(0, 20) + '...',
      })

      if (!refreshToken) {
        logger.warn('[API] No refresh token found in secure storage')
        return null
      }

      logger.info('[API] Sending refresh request to:', `${ENV.API_URL}/api/v1/auth/refresh`)
      const response = await fetch(`${ENV.API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ENV.API_KEY,
        },
        body: JSON.stringify({ refreshToken }), // Changed from refresh_token to refreshToken
      })

      logger.info('[API] Refresh response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        logger.warn('[API] Token refresh failed:', {
          status: response.status,
          error: errorText,
        })
        return null
      }

      const data: RefreshTokenResponse = await response.json()
      logger.info('[API] Refresh response data:', data)

      // Backend returns { data: { accessToken, refreshToken } }
      const { accessToken, refreshToken: newRefreshToken } = data.data
      await setToken(accessToken)

      // Store new refresh token if provided
      if (newRefreshToken) {
        const { setRefreshToken } = await import('@shared/utils/storage')
        await setRefreshToken(newRefreshToken)
        logger.info('[API] New refresh token saved')
      }

      logger.info('[API] Token refresh successful, new access token saved')
      return accessToken
    } catch (error) {
      logger.error('[API] Token refresh error:', error)
      return null
    }
  }

  private async handleSessionExpired(): Promise<void> {
    logger.warn('[API] Session expired - clearing tokens and updating auth state')

    // Dynamically import to avoid circular dependency
    const { useAuthStore } = await import('@shared/stores/auth.store')
    const i18n = await import('i18next')

    await useAuthStore.getState().handleSessionExpiry()

    // Show toast notification with i18n
    Toast.show({
      type: 'error',
      text1: i18n.default.t('common.sessionExpired'),
      text2: i18n.default.t('common.sessionExpiredMessage'),
      visibilityTime: 4000,
    })
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const error = await response.json()
      const errorMessage = error.message || `HTTP Error: ${response.status}`
      const errorObject = new Error(errorMessage)

      // Log API errors to Sentry (exclude 4xx client errors except 401)
      if (response.status >= 500 || response.status === 401) {
        Sentry.captureException(errorObject, {
          contexts: {
            api: {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
              errorData: error,
            },
          },
        })
      }

      return errorObject
    } catch {
      const errorObject = new Error(`HTTP Error: ${response.status}`)

      // Log parsing errors to Sentry for server errors
      if (response.status >= 500) {
        Sentry.captureException(errorObject, {
          contexts: {
            api: {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
            },
          },
        })
      }

      return errorObject
    }
  }

  // Convenience methods
  get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  patch<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()
