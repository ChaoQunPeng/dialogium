import type { IItemConfig } from '../interface';

/**
 * 紫炎心 - 傅山亲制，紫炎流转
 * 属性：高防御、高气血、增加灵力上限
 */
const ziYanXin: Record<string, IItemConfig> = {
  zi_yan_xin: {
    id: 'zi_yan_xin',
    name: '紫炎心',
    category: 'equipment',
    description: '筑基法宝',
    slot: 'innerAlchemy',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 40,
      speed: 30,
    },
  },
};

export { ziYanXin };
