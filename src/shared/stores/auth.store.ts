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
  },

  loadToken: async () => {
    try {
      const token = await getToken()
      set({
        token,
        isAuthenticated: !!token,
        isLoading: false,
      })
    } catch {
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))
