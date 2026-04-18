import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { storage } from '@lib/storage';

const PERSISTER_KEY = 'tanstack-query-cache';

const mmkvAsyncAdapter = {
  getItem: (key: string): Promise<string | null> => Promise.resolve(storage.getString(key) ?? null),
  setItem: (key: string, value: string): Promise<void> => {
    storage.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    storage.remove(key);
    return Promise.resolve();
  },
};

export const queryPersister = createAsyncStoragePersister({
  storage: mmkvAsyncAdapter,
  key: PERSISTER_KEY,
  throttleTime: 1000,
});
