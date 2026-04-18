import { describe, expect, it, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => {
  const mockSelect = { eq: vi.fn().mockReturnThis(), single: vi.fn() };
  return {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    from: vi.fn(() => ({ select: () => mockSelect })),
    mockSelect,
  };
});

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      signOut: mocks.signOut,
      getUser: mocks.getUser,
    },
    from: mocks.from,
  },
}));

import { authService } from '@features/auth/services/auth.service';

const mockClientRow = {
  id: 'client-1',
  user_id: 'user-1',
  email: 'test@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  phone: null,
  skin_type: null,
  birthday: null,
  avatar_url: null,
  has_routine_access: false,
  created_at: '2025-01-01T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authService.login', () => {
  it('resolves on success', async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    await expect(
      authService.login({ email: 'test@example.com', password: 'secret' }),
    ).resolves.toBeUndefined();
  });

  it('throws mapped error on invalid credentials', async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: { code: 'invalid_credentials' } });
    await expect(
      authService.login({ email: 'bad@example.com', password: 'wrong' }),
    ).rejects.toThrow('auth.invalidCredentials');
  });
});

describe('authService.register', () => {
  it('resolves on success', async () => {
    mocks.signUp.mockResolvedValue({ error: null });
    await expect(
      authService.register({
        email: 'new@example.com',
        password: 'secret',
        firstname: 'Jane',
        lastname: 'Doe',
      }),
    ).resolves.toBeUndefined();
  });

  it('throws mapped error when email already exists', async () => {
    mocks.signUp.mockResolvedValue({ error: { code: 'user_already_exists' } });
    await expect(
      authService.register({
        email: 'existing@example.com',
        password: 'secret',
        firstname: 'Jane',
        lastname: 'Doe',
      }),
    ).rejects.toThrow('auth.emailAlreadyExists');
  });
});

describe('authService.logout', () => {
  it('resolves on success', async () => {
    mocks.signOut.mockResolvedValue({ error: null });
    await expect(authService.logout()).resolves.toBeUndefined();
  });

  it('throws mapped error on failure', async () => {
    mocks.signOut.mockResolvedValue({ error: { code: 'session_expired' } });
    await expect(authService.logout()).rejects.toThrow('common.sessionExpired');
  });
});

describe('authService.getMe', () => {
  it('returns client row when session is valid', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mocks.mockSelect.single.mockResolvedValue({ data: mockClientRow, error: null });
    mocks.from.mockReturnValue({ select: () => mocks.mockSelect });

    const result = await authService.getMe();
    expect(result).toEqual(mockClientRow);
  });

  it('throws sessionExpired when no user in session', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    await expect(authService.getMe()).rejects.toThrow('common.sessionExpired');
  });

  it('throws mapped error on DB failure', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mocks.mockSelect.single.mockResolvedValue({ data: null, error: { code: '42501' } });
    mocks.from.mockReturnValue({ select: () => mocks.mockSelect });

    await expect(authService.getMe()).rejects.toThrow('common.permissionDenied');
  });
});
