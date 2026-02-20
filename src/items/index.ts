import equipment from './equipment/index';
import consumable from './consumable/index';
// import material from './material/index';
import type { IItem } from '@/interface';

export const items: Record<string, IItem> = {
  ...equipment,
  ...consumable,
  // ...material,
};
