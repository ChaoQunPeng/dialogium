import type { IItem } from '@/interface';
import { ge_bu_lin } from './ge_bu_lin';

const material: Record<string, IItem> = {
  xuan_tie: {
    id: 'xuan_tie',
    name: '玄铁',
    category: 'material',
    description: '玄铁，可用来制作高级武器',
    price: 10,
    stackable: true,
  },
};

export default {
  ...material,
  ...ge_bu_lin,
};
