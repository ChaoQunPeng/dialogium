import type { IItemConfig } from '../interface';

/**
 * 五色焰罗罩 - 防护法宝，属性：全方位防护、能量屏障、隐身功能
 */
const wuSeYanLuoZhao: Record<string, IItemConfig> = {
  // 主防护装备
  wu_se_yan_luo_zhao_shield: {
    id: 'wu_se_yan_luo_zhao_shield',
    name: '五色焰罗罩',
    category: 'equipment',
    description: '傅山使用的防护法宝，五彩流动的半圆罩，能够抵挡各种攻击和危险。',
    slot: 'body',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 250,
      hp: 200,
    },
  },

  // 罩子核心控制器
  wu_se_yan_luo_zhao_controller: {
    id: 'wu_se_yan_luo_zhao_controller',
    name: '焰罗控制器',
    category: 'equipment',
    description: '控制五色焰罗罩的核心装置，能够调节防护强度和范围。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 100,
      mp: 150,
    },
  },
};

export { wuSeYanLuoZhao };