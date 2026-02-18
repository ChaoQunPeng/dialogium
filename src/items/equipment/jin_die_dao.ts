import type { IItemConfig } from '../interface';

/**
 * 金蝶刀 - 傅山成名兵刃，封缘星制器大师夜暗魂制造
 * 属性：极速攻击、群体伤害、破防能力
 */
const jinDieDao: Record<string, IItemConfig> = {
  // 主武器
  jin_die_dao_weapon: {
    id: 'jin_die_dao_weapon',
    name: '金蝶刀',
    category: 'equipment',
    description: '傅山的成名兵刃，由封缘星制器大师夜暗魂制造。刀身如金蝶翩翩起舞，可分化万千攻击敌人。',
    slot: 'weapon',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      attack: 300,
      speed: 50,
      crit: 20,
    },
  },

  // 刀鞘配件
  jin_die_dao_sheath: {
    id: 'jin_die_dao_sheath',
    name: '金蝶刀鞘',
    category: 'equipment',
    description: '金蝶刀的专属刀鞘，蕴含特殊阵法，可增强刀刃的锋锐度。',
    slot: 'accessory',
    level: 1,
    price: 0,
    stackable: false,
    stats: {
      attack: 50,
      defense: 30,
    },
  },
};

export { jinDieDao };