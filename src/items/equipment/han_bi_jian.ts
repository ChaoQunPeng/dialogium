import type { IItem } from '@/interface';

/**
 * 寒碧剑 - 傅山成名兵刃，属性：冰寒属性、减速效果、范围冻结
 */
const hanBiJian: Record<string, IItem> = {
  // 主武器
  han_bi_jian_weapon: {
    id: 'han_bi_jian_weapon',
    name: '寒碧剑',
    category: 'equipment',
    description: '傅山的另一件成名兵刃，剑身散发着刺骨寒气，不沾上鲜血决不回头。',
    slot: 'weapon',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      attack: 280,
      defense: 40,
      speed: 30,
    },
  },

  // 剑穗装饰
  han_bi_jian_tassel: {
    id: 'han_bi_jian_tassel',
    name: '寒碧剑穗',
    category: 'equipment',
    description: '由千年寒蚕丝编织而成的剑穗，能够增强剑气的凝聚效果。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      mp: 80,
      defense: 20,
    },
  },
};

export { hanBiJian };
