import { ENV } from '@shared/config/env'
import type { RefreshTokenResponse } from '@shared/types/api.types'
import { getRefreshToken, getToken, setToken } from '@shared/utils/storage'
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
    console.log('[API] Request:', { url, method: fetchOptions.method, body })

    let response: Response
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
      console.log('[API] Response status:', response.status)
    } catch (error) {
      console.log('[API] Fetch error:', error)
      throw error
    }

    if (response.status === 401 && !skipAuth) {
      const newToken = await this.refreshAccessToken()
      if (newToken) {
        ;(headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`
        const retryResponse = await fetch(`${ENV.API_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })

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
      console.log('[API] Attempting to refresh access token')
      const refreshToken = await getRefreshToken()
      if (!refreshToken) {
        console.log('[API] No refresh token found')
        return null
      }

      const response = await fetch(`${ENV.API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ENV.API_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        console.log('[API] Token refresh failed:', response.status)
        return null
      }

      const data: RefreshTokenResponse = await response.json()
      await setToken(data.access_token)
      console.log('[API] Token refresh successful')
      return data.access_token
    } catch (error) {
      console.log('[API] Token refresh error:', error)
      return null
    }
  }

  private async handleSessionExpired(): Promise<void> {
    console.log('[API] Session expired - clearing tokens and updating auth state')

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
      return new Error(error.message || `HTTP Error: ${response.status}`)
    } catch {
      return new Error(`HTTP Error: ${response.status}`)
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
