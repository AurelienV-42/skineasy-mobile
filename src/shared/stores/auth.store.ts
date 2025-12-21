import { create } from 'zustand'
import {
  getToken,
  setToken,
  removeToken,
  setRefreshToken,
  clearAllTokens,
} from '@shared/utils/storage'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>
  clearAuth: () => Promise<void>
  loadToken: () => Promise<void>
  handleSessionExpiry: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: async (accessToken, refreshToken) => {
    await setToken(accessToken)
    if (refreshToken) {
      await setRefreshToken(refreshToken)
    }
    set({ token: accessToken, isAuthenticated: true })
  },

  clearAuth: async () => {
    await clearAllTokens()
    set({ token: null, isAuthenticated: false })
    // Clear user data when logging out
    const { useUserStore } = await import('@shared/stores/user.store')
    useUserStore.getState().clearUser()
  },

  handleSessionExpiry: async () => {
    await clearAllTokens()
    set({ token: null, isAuthenticated: false })
    // Clear user data when session expires
    const { useUserStore } = await import('@shared/stores/user.store')
    useUserStore.getState().clearUser()
  },

  loadToken: async () => {
    console.log('[authStore] loadToken - Starting...')
    try {
      const token = await getToken()
      console.log('[authStore] loadToken - Token loaded:', !!token)
      set({
        token,
        isAuthenticated: !!token,
        isLoading: false,
      })
    } catch (error) {
      console.log('[authStore] loadToken - Error:', error)
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))
