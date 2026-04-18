export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  skinType?: string;
  birthday?: string;
  avatar?: string | null;
  hasRoutineAccess: boolean;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserState {
  user: UserProfile | null;
  hasDiagnosis: boolean;
}
