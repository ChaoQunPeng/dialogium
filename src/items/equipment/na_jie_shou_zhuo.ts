import type { IItem } from '@/interface';

/**
 * 纳芥手镯 - 高级储物法宝，属性：超大容量、空间压缩、物品分类
 */
const naJieShouZhuo: Record<string, IItem> = {
  // 主装备
  na_jie_shou_zhuo_belt: {
    id: 'na_jie_shou_zhuo_belt',
    name: '纳芥手镯',
    category: 'equipment',
    description: '修真者专用储物法宝，专门用来储物。发黑的深褐色，淡淡的花纹闪著神秘的银色光晕。',
    slot: 'belt',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 30,
      mp: 100,
    },
  },

  // 手镯配件
  na_jie_shou_zhuo_core: {
    id: 'na_jie_shou_zhuo_core',
    name: '纳芥核心',
    category: 'equipment',
    description: '纳芥手镯的核心部件，蕴含空间法则，是储物功能的关键。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      mp: 150,
    },
  },
};

export { naJieShouZhuo };
