import { STORAGE_KEYS } from '@/constants';

export const hasSavedGame = (storage: Pick<Storage, 'getItem'>): boolean => {
  return Boolean(storage.getItem(STORAGE_KEYS.PLAYER_DATA));
};