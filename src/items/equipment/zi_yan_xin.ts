import type { IItem } from '@/interface';

const ziYanXin: Record<string, IItem> = {
  zi_yan_xin_item: {
    id: 'zi_yan_xin_item',
    name: '紫炎心',
    category: 'material',
    description: '真火之源',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      attack: 100,
      defense: 100,
      hp: 100,
      mp: 100,
    },
  },
};

export { ziYanXin };
