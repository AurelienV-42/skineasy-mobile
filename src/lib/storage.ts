import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

const ENCRYPTION_KEY_ID = 'mmkv.encryption.key';

function getOrCreateEncryptionKey(): string {
  let key = SecureStore.getItem(ENCRYPTION_KEY_ID);
  if (!key) {
    const rand = (): string => Math.random().toString(36).substring(2);
    key = rand() + rand() + rand();
    SecureStore.setItem(ENCRYPTION_KEY_ID, key);
  }
  return key;
}

export const storage = createMMKV({
  id: 'skineasy-storage',
  encryptionKey: getOrCreateEncryptionKey(),
});
