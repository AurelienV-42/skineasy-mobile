import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@shared/stores/user.store';
import type { UserProfile } from '@shared/types/user.types';
import type { ResolveRoutineResult } from '@features/routine/data/resolve-routine.api';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      hasDiagnosis: false,
    });
  });

  it('should have initial state', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.hasDiagnosis).toBe(false);
  });

  it('should set user', () => {
    const mockUser: UserProfile = {
      id: 'uuid-1',
      user_id: 'auth-uuid-1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      skin_type: 'oily',
      has_routine_access: false,
    };

    const { setUser } = useUserStore.getState();
    setUser(mockUser);

    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
  });

  it('should set hasDiagnosis', () => {
    const { setHasDiagnosis } = useUserStore.getState();
    setHasDiagnosis(true);

    const state = useUserStore.getState();
    expect(state.hasDiagnosis).toBe(true);
  });

  it('should clear user', () => {
    useUserStore.setState({
      user: {
        id: 'uuid-1',
        user_id: 'auth-uuid-1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        has_routine_access: false,
      },
      hasDiagnosis: true,
    });

    const { clearUser } = useUserStore.getState();
    clearUser();

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.hasDiagnosis).toBe(false);
  });

  describe('routineResolution', () => {
    it('starts as null', () => {
      expect(useUserStore.getState().routineResolution).toBeNull();
    });

    it.each<ResolveRoutineResult>([
      { status: 'needs_form' },
      { status: 'needs_purchase' },
      { status: 'response_found_generation_pending' },
      { status: 'typeform_unavailable' },
      {
        status: 'ready',
        routine: {
          id: 'r-1',
          user_id: 'u-1',
          status: 'ready',
          algorithm_version: 'v1',
          created_at: '2026-01-01T00:00:00.000Z',
        },
      },
    ])('setRoutineResolution stores status "$status"', (result) => {
      const { setRoutineResolution } = useUserStore.getState();
      setRoutineResolution(result);
      expect(useUserStore.getState().routineResolution?.status).toBe(result.status);
    });

    it('clearUser resets routineResolution to null', () => {
      useUserStore.setState({ routineResolution: { status: 'needs_form' } });
      useUserStore.getState().clearUser();
      expect(useUserStore.getState().routineResolution).toBeNull();
    });

    it('setRoutineResolution accepts null', () => {
      useUserStore.setState({ routineResolution: { status: 'needs_form' } });
      useUserStore.getState().setRoutineResolution(null);
      expect(useUserStore.getState().routineResolution).toBeNull();
    });
  });
});
