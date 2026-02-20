import type { IItem } from '@/interface';

/**
 * 潭博手镯 - 同类储物镯子中最好的，属性：极致容量、多重空间、自动整理
 */
const tanBoShouZhuo: Record<string, IItem> = {
  // 主装备
  tan_bo_shou_zhuo_belt: {
    id: 'tan_bo_shou_zhuo_belt',
    name: '潭博手镯',
    category: 'equipment',
    description: '同类储物镯子中最好的一种，颜色是钴篮色，镯面有一丝一丝钴篮色挤出来的银星闪动。',
    slot: 'belt',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 50,
      mp: 200,
    },
  },

  // 手镯强化配件
  tan_bo_shou_zhuo_enhancer: {
    id: 'tan_bo_shou_zhuo_enhancer',
    name: '潭博增幅器',
    category: 'equipment',
    description: '用于增强潭博手镯储物能力的特殊配件，能够让储物空间扩大数倍。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      mp: 300,
    },
  },
};

export { tanBoShouZhuo };
