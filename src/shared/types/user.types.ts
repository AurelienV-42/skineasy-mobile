export interface UserProfile {
  id: string
  email: string
  firstname: string
  lastname: string
  skinType?: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface UserState {
  user: UserProfile | null
  hasDiagnosis: boolean
}
