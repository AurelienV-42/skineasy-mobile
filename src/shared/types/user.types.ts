export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  skin_type?: string | null;
  birthday?: string | null;
  avatar_url?: string | null;
  has_routine_access: boolean;
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
