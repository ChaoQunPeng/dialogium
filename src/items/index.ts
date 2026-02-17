import type { IItemConfig } from './interface';
import { manTianXin } from './equipment/man_tian_xing';

export const items: Record<string, IItemConfig> = {
  ...manTianXin,
};
