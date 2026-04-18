import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@shared/stores/auth.store';

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

vi.mock('@shared/stores/user.store', () => ({
  useUserStore: {
    getState: () => ({ clearUser: vi.fn() }),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: true });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it('should set authenticated to true', () => {
    useAuthStore.getState().setAuthenticated(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should set authenticated to false', () => {
    useAuthStore.setState({ isAuthenticated: true, isLoading: false });
    useAuthStore.getState().setAuthenticated(false);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should clear auth and sign out', async () => {
    useAuthStore.setState({ isAuthenticated: true, isLoading: false });
    await useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
