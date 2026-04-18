import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn();
  chain.upsert = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.lte = vi.fn().mockReturnValue(chain);

  return {
    getUser: vi.fn(),
    from: vi.fn(() => chain),
    storageFrom: vi.fn(),
    uploadFile: vi.fn(),
    compressImage: vi.fn(),
    chain,
  };
});

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    from: mocks.from,
    storage: { from: mocks.storageFrom },
  },
}));

vi.mock('@lib/upload', () => ({ uploadFile: mocks.uploadFile }));
vi.mock('@shared/utils/image', () => ({ compressImage: mocks.compressImage }));

import { getSleepByDate, upsertSleep, deleteSleep } from '@features/journal/data/sleep.api';
import { getMealByDate, uploadMealPhoto } from '@features/journal/data/meal.api';
import { upsertObservations } from '@features/journal/data/observation.api';
import { getSportTypes } from '@features/journal/data/sport.api';

const USER_ID = 'user-1';

function setChainResolution(response: { data: unknown; error: unknown }) {
  const { chain } = mocks;
  (chain as Record<string, unknown>).then = (resolve: (val: unknown) => unknown) =>
    Promise.resolve(response).then(resolve);
  mocks.chain.single = vi.fn().mockResolvedValue(response);
  mocks.from.mockReturnValue(chain);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.from.mockReturnValue(mocks.chain);
});

describe('getSleepByDate', () => {
  it('returns entries for user and date', async () => {
    const entries = [{ id: 's1', user_id: USER_ID, date: '2025-01-15', hours: 8, quality: 4 }];
    setChainResolution({ data: entries, error: null });

    const result = await getSleepByDate('2025-01-15');
    expect(result).toEqual(entries);
  });

  it('throws sessionExpired when no user', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    await expect(getSleepByDate('2025-01-15')).rejects.toThrow('common.sessionExpired');
  });

  it('throws mapped error on DB failure', async () => {
    setChainResolution({ data: null, error: { code: '42501' } });
    await expect(getSleepByDate('2025-01-15')).rejects.toThrow('common.permissionDenied');
  });
});

describe('upsertSleep', () => {
  it('upserts with user_id and onConflict', async () => {
    const entry = { id: 's1', user_id: USER_ID, date: '2025-01-15', hours: 7, quality: 3 };
    setChainResolution({ data: entry, error: null });

    const result = await upsertSleep({ date: '2025-01-15', hours: 7, quality: 3 });
    expect(result).toEqual(entry);
    expect(mocks.chain.upsert).toHaveBeenCalledWith(expect.objectContaining({ user_id: USER_ID }), {
      onConflict: 'user_id,date',
    });
  });

  it('throws mapped error on DB failure', async () => {
    setChainResolution({ data: null, error: { code: '23505' } });
    await expect(upsertSleep({ date: '2025-01-15', hours: 7, quality: 3 })).rejects.toThrow(
      'common.duplicateEntry',
    );
  });
});

describe('deleteSleep', () => {
  it('deletes by id without throwing', async () => {
    setChainResolution({ data: null, error: null });
    await expect(deleteSleep('s1')).resolves.toBeUndefined();
  });
});

describe('getMealByDate', () => {
  it('returns entries without photo as-is', async () => {
    const entry = { id: 'm1', user_id: USER_ID, date: '2025-01-15', photo_url: null };
    setChainResolution({ data: [entry], error: null });

    const result = await getMealByDate('2025-01-15');
    expect(result[0].photo_url).toBeNull();
  });

  it('replaces storage path with signed URL', async () => {
    const entry = { id: 'm1', user_id: USER_ID, date: '2025-01-15', photo_url: 'user-1/path.jpg' };
    setChainResolution({ data: [entry], error: null });
    mocks.storageFrom.mockReturnValue({
      createSignedUrl: vi.fn().mockResolvedValue({
        data: { signedUrl: 'https://signed.url/photo.jpg' },
        error: null,
      }),
    });

    const result = await getMealByDate('2025-01-15');
    expect(result[0].photo_url).toBe('https://signed.url/photo.jpg');
  });
});

describe('uploadMealPhoto', () => {
  it('compresses, uploads, and returns storage path', async () => {
    mocks.compressImage.mockResolvedValue('compressed.jpg');
    mocks.uploadFile.mockResolvedValue({ path: `${USER_ID}/2025-01-15/123.jpg` });

    const path = await uploadMealPhoto('original.jpg', '2025-01-15');

    expect(mocks.compressImage).toHaveBeenCalledWith('original.jpg');
    expect(mocks.uploadFile).toHaveBeenCalledWith(
      'meal-photos',
      expect.stringContaining(`${USER_ID}/2025-01-15/`),
      'compressed.jpg',
      { contentType: 'image/jpeg' },
    );
    expect(path).toContain(`${USER_ID}/2025-01-15/`);
  });
});

describe('upsertObservations', () => {
  it('stores positives and negatives as text arrays', async () => {
    const entry = {
      id: 'o1',
      user_id: USER_ID,
      date: '2025-01-15',
      positives: ['good sleep', 'exercise'],
      negatives: ['stress'],
    };
    setChainResolution({ data: entry, error: null });

    const result = await upsertObservations({
      date: '2025-01-15',
      positives: ['good sleep', 'exercise'],
      negatives: ['stress'],
    });

    expect(result.positives).toEqual(['good sleep', 'exercise']);
    expect(result.negatives).toEqual(['stress']);
    expect(mocks.chain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ positives: ['good sleep', 'exercise'] }),
      { onConflict: 'user_id,date' },
    );
  });
});

describe('getSportTypes', () => {
  it('returns all sport types without requiring auth', async () => {
    const types = [
      { id: 't1', name: 'yoga' },
      { id: 't2', name: 'running' },
    ];
    setChainResolution({ data: types, error: null });

    const result = await getSportTypes();
    expect(result).toEqual(types);
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
});
