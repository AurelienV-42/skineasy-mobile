import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(),
}));

vi.mock('@lib/supabase', () => ({
  supabase: {
    functions: { invoke: mocks.invoke },
  },
}));

import { resolveRoutine } from '@features/routine/data/resolve-routine.api';
import type { ResolveRoutineResult } from '@features/routine/data/resolve-routine.api';

const RESOLVED_ROUTINE = {
  id: 'routine-1',
  user_id: 'user-1',
  status: 'ready',
  algorithm_version: 'v1',
  created_at: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('resolveRoutine', () => {
  it('returns ready status with routine data', async () => {
    const payload: ResolveRoutineResult = { status: 'ready', routine: RESOLVED_ROUTINE };
    mocks.invoke.mockResolvedValue({ data: payload, error: null });

    const result = await resolveRoutine();

    expect(result.status).toBe('ready');
    if (result.status === 'ready') {
      expect(result.routine.id).toBe('routine-1');
    }
    expect(mocks.invoke).toHaveBeenCalledWith('resolve-routine');
  });

  it('returns response_found_generation_pending status', async () => {
    const payload: ResolveRoutineResult = { status: 'response_found_generation_pending' };
    mocks.invoke.mockResolvedValue({ data: payload, error: null });

    const result = await resolveRoutine();
    expect(result.status).toBe('response_found_generation_pending');
  });

  it('returns needs_form status', async () => {
    const payload: ResolveRoutineResult = { status: 'needs_form' };
    mocks.invoke.mockResolvedValue({ data: payload, error: null });

    const result = await resolveRoutine();
    expect(result.status).toBe('needs_form');
  });

  it('returns needs_purchase status', async () => {
    const payload: ResolveRoutineResult = { status: 'needs_purchase' };
    mocks.invoke.mockResolvedValue({ data: payload, error: null });

    const result = await resolveRoutine();
    expect(result.status).toBe('needs_purchase');
  });

  it('returns typeform_unavailable status', async () => {
    const payload: ResolveRoutineResult = { status: 'typeform_unavailable' };
    mocks.invoke.mockResolvedValue({ data: payload, error: null });

    const result = await resolveRoutine();
    expect(result.status).toBe('typeform_unavailable');
  });

  it('throws mapped error on function invocation error', async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: { message: 'Unauthorized' } });

    await expect(resolveRoutine()).rejects.toThrow();
  });

  it('throws common.error when data is null', async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: null });

    await expect(resolveRoutine()).rejects.toThrow('common.error');
  });
});
