import type { IItem } from '@/interface';

/**
 * 满天星套装 - 傅山亲制，紫炎流转
 * 属性：高防御、高气血、增加灵力上限
 */
export const manTianXin: Record<string, IItem> = {
  // 1. 上衣
  man_tian_xin_body: {
    id: 'man_tian_xin_body',
    name: '满天星·内甲',
    category: 'equipment',
    description: '傅山赠送的极品内甲，由紫炎真火淬炼，能抵挡修真高手的真气冲击。',
    slot: 'body',
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

  // 2. 头肩
  man_tian_xin_shoulder: {
    id: 'man_tian_xin_shoulder',
    name: '满天星·肩铠',
    category: 'equipment',
    description: '银色甲胄包裹肩部，保护灵识不受外邪入侵。',
    slot: 'shoulder',
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

  // 3. 腰带
  man_tian_xin_belt: {
    id: 'man_tian_xin_belt',
    name: '满天星·束带',
    category: 'equipment',
    description: '由极品天蚕丝混合陨铁织就，中间镶嵌紫炎晶石。',
    slot: 'belt',
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

  // 4. 下装
  man_tian_xin_leg: {
    id: 'man_tian_xin_leg',
    name: '满天星·腿甲',
    category: 'equipment',
    description: '轻便且坚韧，能够大幅缓冲落地时的冲击力。',
    slot: 'leg',
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

  // 5. 鞋子
  man_tian_xin_shoes: {
    id: 'man_tian_xin_shoes',
    name: '满天星·步履',
    category: 'equipment',
    description: '穿戴后身轻如燕，即便在碎石地也能如履平地。',
    slot: 'shoes',
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

// const manTianXinSet = {
//   man_tian_xin: {
//     name: '满天星套装',
//     bonuses: [
//       { count: 3, stats: { defense: 50 }, desc: '三件凑齐：防御+50' },
//       { count: 5, stats: { defense: 150 }, desc: '全套集齐：防御+150' },
//     ],
//   },
// };

// /**
//  * 统一合并所有物品，形成最终的静态配置表
//  */
// export const ITEMS_CONFIG: Record<string, IItem> = {
//   ...ZiYanXin,
//   ...manTianXin,
// };

// /**
//  * 辅助：如果你需要获取所有物品的列表（比如渲染图鉴）
//  */
// export const ALL_ITEMS_LIST = Object.values(ITEMS_CONFIG);
