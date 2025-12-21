import { create } from 'zustand'
import type { UserProfile } from '@shared/types/user.types'
import { logger } from '@shared/utils/logger'

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
    logger.info('[userStore] setUser called with:', user)
    set({ user })
  },

  setHasDiagnosis: (value) => {
    logger.info('[userStore] setHasDiagnosis called with:', value)
    set({ hasDiagnosis: value })
  },

  clearUser: () => {
    logger.info('[userStore] clearUser called')
    set({ user: null, hasDiagnosis: false })
  },
}))
