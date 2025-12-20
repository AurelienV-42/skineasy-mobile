import { create } from 'zustand'
import type { UserProfile } from '@shared/types'

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

  setUser: (user) => set({ user }),

  setHasDiagnosis: (value) => set({ hasDiagnosis: value }),

  clearUser: () => set({ user: null, hasDiagnosis: false }),
}))
