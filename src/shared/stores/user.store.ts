import { create } from 'zustand'
import type { UserProfile } from '@shared/types/user.types'

interface UserState {
  user: UserProfile | null
  hasDiagnosis: boolean
  setUser: (user: UserProfile) => void
  setHasDiagnosis: (value: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hasDiagnosis: false,

  setUser: (user) => {
    console.log('[userStore] setUser called with:', user)
    set({ user })
  },

  setHasDiagnosis: (value) => {
    console.log('[userStore] setHasDiagnosis called with:', value)
    set({ hasDiagnosis: value })
  },

  clearUser: () => {
    console.log('[userStore] clearUser called')
    set({ user: null, hasDiagnosis: false })
  },
}))
