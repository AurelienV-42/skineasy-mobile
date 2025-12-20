import { ENV } from '@shared/config/env'
import type { RefreshTokenResponse } from '@shared/types'
import {
  clearAllTokens,
  getRefreshToken,
  getToken,
  setToken,
} from '@shared/utils/storage'

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
      ...options.headers,
    }

    if (!skipAuth) {
      const token = await getToken()
      if (token) {
        ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${ENV.API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

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
        await clearAllTokens()
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
      const refreshToken = await getRefreshToken()
      if (!refreshToken) {
        return null
      }

      const response = await fetch(`${ENV.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        return null
      }

      const data: RefreshTokenResponse = await response.json()
      await setToken(data.access_token)
      return data.access_token
    } catch {
      return null
    }
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
