import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@lib/storage';

const mmkvStorage = {
  getItem: (key: string): string | null => storage.getString(key) ?? null,
  setItem: (key: string, value: string): void => storage.set(key, value),
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};

interface HiddenProductsState {
  hiddenIds: Record<string, boolean>;
  hideProduct: (productId: string) => void;
  unhideProduct: (productId: string) => void;
  isProductHidden: (productId: string) => boolean;
  getHiddenIds: () => string[];
}

export const useHiddenProductsStore = create<HiddenProductsState>()(
  persist(
    (set, get) => ({
      hiddenIds: {},

      hideProduct: (productId) => {
        set((state) => ({
          hiddenIds: { ...state.hiddenIds, [productId]: true },
        }));
      },

      unhideProduct: (productId) => {
        set((state) => {
          const next = { ...state.hiddenIds };
          delete next[productId];
          return { hiddenIds: next };
        });
      },

      isProductHidden: (productId) => !!get().hiddenIds[productId],

      getHiddenIds: () => Object.keys(get().hiddenIds),
    }),
    {
      name: 'hidden-products-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
