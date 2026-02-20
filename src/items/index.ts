import type { IItemConfig } from './interface';
import equipment from './equipment/index';
import consumable from './consumable/index';
import material from './material/index';

export const items: Record<string, IItemConfig> = {
  ...equipment,
  ...consumable,
  ...material,
};
