import type { IItem } from '@/interface';

/**
 * 金蝶刀 - 傅山成名兵刃，属性：锋利无比、破甲特效、连击能力
 */
const jinDieDao: Record<string, IItem> = {
  // 主武器
  jin_die_dao_weapon: {
    id: 'jin_die_dao_weapon',
    name: '金蝶刀',
    category: 'equipment',
    description: '傅山的成名兵刃，刀身薄如蝉翼，锋利无比，能轻易切开坚硬的岩石。',
    slot: 'weapon',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      attack: 300,
      speed: 40,
    },
  },

  // 刀鞘
  jin_die_dao_sheath: {
    id: 'jin_die_dao_sheath',
    name: '金蝶刀鞘',
    category: 'equipment',
    description: '特制的刀鞘，能够完美收纳金蝶刀，同时保护刀身不受损伤。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      defense: 60,
    },
  },
};

export { jinDieDao };
